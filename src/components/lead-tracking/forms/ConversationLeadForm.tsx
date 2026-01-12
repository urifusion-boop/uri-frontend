import { LeadsService as LeadFormService } from '@/api/LeadFormService';
import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import CustomCheckbox from '@/components/input/CustomCheckbox';
import ListValuesInput from '@/components/input/ListValuesInput';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import BusinessMismatchWarningModal from '@/components/modals/BusinessMismatchWarningModal';
import { LimitExceededModal } from '@/components/modals/LimitExceededModal';
import SmartModal from '@/components/modals/SmartModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import useDebounce from '@/hooks/useDebounce';
import { ConversationalSearchFormDto } from '@/models/dtos/LeadFormDto';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { BrowsercloudPlatformEnum } from '@/models/enum-models/BrowsercloudPlatformEnum';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import BoltIcon from '@mui/icons-material/Bolt';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SaveIcon from '@mui/icons-material/Save';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import PlatformSelector from '../PlatformSelector';

// LocalStorage keys for job state persistence
const JOB_STATE_KEY = 'uri_active_lead_job';

// Helper functions for managing active job state
const saveJobToLocalStorage = (jobId: string, leadFormId: string, userId: string) => {
  try {
    localStorage.setItem(
      JOB_STATE_KEY,
      JSON.stringify({
        jobId,
        leadFormId,
        userId,
        startTime: Date.now(),
      })
    );
  } catch (e) {
    console.error('Failed to save job state:', e);
  }
};

const getJobFromLocalStorage = (userId: string) => {
  try {
    const stored = localStorage.getItem(JOB_STATE_KEY);
    if (!stored) return null;

    const jobState = JSON.parse(stored);
    // Only return if it's for the same user and less than 30 minutes old
    if (jobState.userId === userId && Date.now() - jobState.startTime < 30 * 60 * 1000) {
      return jobState;
    }
    // Clear stale job state
    localStorage.removeItem(JOB_STATE_KEY);
    return null;
  } catch (e) {
    console.error('Failed to read job state:', e);
    return null;
  }
};

const clearJobFromLocalStorage = () => {
  try {
    localStorage.removeItem(JOB_STATE_KEY);
  } catch (e) {
    console.error('Failed to clear job state:', e);
  }
};

const ConversationLeadFormV2 = () => {
  const [debugInfo, setDebugInfo] = useState<string>('Waiting...');

  useEffect(() => {
    setDebugInfo('✅ Component loaded successfully');
  }, []);

  const [form, setForm] = useState<ConversationalSearchFormDto>({
    user_id: '',
    form_title: 'Sales Signal Form V2',
    ai_response_guide: '',
    keywords: [],
    competitors: [],
    intent_type: '',
    buying_signals: [],
    excluded_keywords: [],
    add_to_history: false,
    auto_generate: false,
    form_type: FormTypeEnum.CONVERSATIONAL,
    location: [],
    post_age_filter: 'all',
    enable_realtime: true, // V2 default
    monitoring_platforms: [],
    platform_configs: [],
    monitoring_interval_hours: 0, // Default: one-time only (user can change to recurring)
    // CLG Upgrade fields
    category_context: '',
    implied_keywords: [],
    scoring_thresholds: {
      intent_score_min: 0.55,
      relevance_score_min: 0.5,
      final_score_min: 0.6,
    },
    // Job Boards fields
    solution_context: '',
    job_keywords: [],
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [isFetchingLeads, setIsFetchingLeads] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState<string>('');
  const [targetProgress, setTargetProgress] = useState(0); // Backend's real progress (target)
  const [fetchingProgress, setFetchingProgress] = useState(0); // Smoothly animated display progress
  const [currentTip, setCurrentTip] = useState('');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Store interval refs so we can cleanup on unmount
  const intervalsRef = useRef<{
    tipInterval: NodeJS.Timeout | null;
    progressSimulation: NodeJS.Timeout | null;
    pollInterval: NodeJS.Timeout | null;
    fallbackTimeout: NodeJS.Timeout | null;
    smoothProgressInterval: NodeJS.Timeout | null;
  }>({
    tipInterval: null,
    progressSimulation: null,
    pollInterval: null,
    fallbackTimeout: null,
    smoothProgressInterval: null,
  });
  const [leadStats, setLeadStats] = useState<{
    // Social stats
    social_total_fetched?: number;
    social_qualified?: number;
    social_new_leads?: number;
    social_duplicates?: number;

    // Job board stats
    job_boards_total_fetched?: number; // Total jobs fetched (before AI filtering)
    job_signals_found?: number; // Qualified job signals (after AI filtering)
    job_signals_saved?: number;
    job_signals_high_match?: number;
    job_signals_medium_match?: number;
    job_signals_low_match?: number;

    // Combined totals (backward compatibility)
    total_fetched: number;
    total_qualified: number;
    new_leads_saved: number;
    duplicates_skipped: number;

    // Cancellation flag
    job_cancelled?: boolean;
  } | null>(null);

  const { autoPopulateLeadForm, isAutoPopulating } = useLeadFormHooks();
  const [autoPopulateData, setAutoPopulateData] = useState('');
  const [isEditingAIInput, setIsEditingAIInput] = useState(false);

  const { mutate: triggerAutoPopulate, data: autoPopulatedResponse, isSuccess: autoPopulateSuccess } = autoPopulateLeadForm;
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false);
  const [showLeadGoalModal, setShowLeadGoalModal] = useState(false);
  const leadGoalRef = useRef<HTMLDivElement>(null);

  // Job keyword auto-regeneration state
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [keywordsJustUpdated, setKeywordsJustUpdated] = useState(false);
  const [keywordsLocked, setKeywordsLocked] = useState(false);

  // Business mismatch warning modal state
  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [mismatchData, setMismatchData] = useState<{
    match_score: number;
    reasoning: string;
    recommendation: 'proceed' | 'use_only_social' | 'use_only_job_boards' | 'update_search';
    suggested_social_keywords: string[];
  } | null>(null);
  const [pendingSubmit, setPendingSubmit] = useState(false); // Track if waiting for user decision

  const { userDetails, subscriptionPlanType } = useAuth();
  const userId = userDetails?.userId;
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  // Fetch user's business details from uri-insights backend
  const [userBusinessDetails, setUserBusinessDetails] = useState<any>(null);

  // Cancellation state
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      console.log('🔍 Fetching business details for userId:', userId);
      // Fetch business details via proper service endpoint
      LeadFormService.getUserBusinessDetails(userId)
        .then((response) => {
          console.log('📦 Business details response:', response);
          if (response.status && response.responseData) {
            console.log('✅ Business details loaded:', response.responseData);
            setUserBusinessDetails(response.responseData);
            setDebugInfo(`✅ Loaded: ${JSON.stringify(response.responseData)}`);
          } else {
            console.warn('⚠️ No business details in response');
            setDebugInfo(`⚠️ Response: ${JSON.stringify(response)}`);
          }
        })
        .catch((error) => {
          console.error('❌ Business details error:', error);
          setDebugInfo(`❌ Error: ${error.message}`);
        });
    }
  }, [userId]);

  const { createConversationalSearchLeadForm, updateConversationalSearchLeadForm, useGetExistingFormType, useGetLeadFormById, useGetFormsByUserAndType } = useLeadFormHooks();

  // Check if we're in create mode (creating a new form) or edit mode (editing existing)
  const isCreateMode = router.query.mode === 'create';
  const formIdFromUrl = router.query.form_id as string;

  // Fetch form by ID if form_id is provided, otherwise fetch by type (gets first/default)
  const { data: formById, isSuccess: isSuccessById } = useGetLeadFormById(formIdFromUrl);
  const { data: formByType, isSuccess: isSuccessByType } = useGetExistingFormType(userId || '', FormTypeEnum.CONVERSATIONAL);

  // Fetch all forms of this type for the selector dropdown
  const { data: allFormsOfType = [] } = useGetFormsByUserAndType(userId || '', FormTypeEnum.CONVERSATIONAL);

  // Priority: form_id > form_type (specific form takes precedence)
  const existingForm = formIdFromUrl ? formById : formByType;
  const isSuccess = formIdFromUrl ? isSuccessById : isSuccessByType;

  const hasMultipleForms = allFormsOfType.length > 1;

  const handleFormSelect = (formId: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, form_id: formId },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    console.log('existingForm', existingForm);
    // Only load existing form data if NOT in create mode
    if (existingForm && isSuccess && userId && !isCreateMode) {
      const { form_title, intent_type, buying_signals, excluded_keywords, ai_response_guide, keywords, competitors, lead_form_id, add_to_history, auto_generate, form_type, lead_generation_goal } =
        existingForm as any;

      setForm({
        user_id: userId,
        form_title,
        intent_type,
        buying_signals,
        excluded_keywords,
        ai_response_guide,
        keywords,
        competitors,
        add_to_history,
        auto_generate,
        form_type,
        location: (existingForm as any).location || [],
        post_age_filter: (existingForm as any).post_age_filter || 'all',
        enable_realtime: true,
        monitoring_platforms: (existingForm as any).monitoring_platforms || [],
        platform_configs: (existingForm as any).platform_configs || [],
        monitoring_interval_hours: (existingForm as any).monitoring_interval_hours ?? 0, // Use ?? to preserve 0 value
        // CLG Upgrade fields
        category_context: (existingForm as any).category_context || '',
        implied_keywords: (existingForm as any).implied_keywords || [],
        scoring_thresholds: (existingForm as any).scoring_thresholds || {
          intent_score_min: 0.55,
          relevance_score_min: 0.5,
          final_score_min: 0.6,
        },
        // Job Boards fields
        solution_context: (existingForm as any).solution_context || '',
        job_keywords:
          (form.job_keywords?.length ?? 0) > 0
            ? form.job_keywords // Keep locally regenerated keywords
            : (existingForm as any).job_keywords || [], // Only load from DB if form is empty
        // AI Next Steps
        lead_generation_goal: lead_generation_goal || '',
      });

      setExistingFormId(lead_form_id);
    } else if (isCreateMode) {
      // In create mode, reset form to blank state and ensure existingFormId is null
      setForm({
        user_id: userId || '',
        form_title: 'Sales Signal Form V2',
        ai_response_guide: '',
        keywords: [],
        competitors: [],
        intent_type: '',
        buying_signals: [],
        excluded_keywords: [],
        add_to_history: false,
        auto_generate: false,
        form_type: FormTypeEnum.CONVERSATIONAL,
        location: [],
        post_age_filter: 'all',
        enable_realtime: true,
        monitoring_platforms: [],
        platform_configs: [],
        monitoring_interval_hours: 0,
        category_context: '',
        implied_keywords: [],
        scoring_thresholds: {
          intent_score_min: 0.55,
          relevance_score_min: 0.5,
          final_score_min: 0.6,
        },
        solution_context: '',
        job_keywords: [],
        lead_generation_goal: '',
      });
      setExistingFormId(null);
    }
  }, [existingForm, isSuccess, userId, isCreateMode, formIdFromUrl]);

  // Track if Job Boards is enabled using useMemo
  const isJobBoardsEnabled = useMemo(() => {
    const enabled = form.platform_configs?.some((config) => config.platform === 'JOB_BOARDS' && config.enabled) || false;
    console.log('🔄 Job Boards enabled state changed:', enabled);
    return enabled;
  }, [form.platform_configs]);

  // Debounced solution context for auto-regeneration
  const debouncedSolutionContext = useDebounce(form.solution_context, 1500);

  // PRD Section 5: Auto-generate job keywords when Job Boards platform is enabled (INITIAL GENERATION)
  // NOTE: This only runs when Job Boards is FIRST enabled, not on every page load
  useEffect(() => {
    console.log('🔍 Job Boards Auto-Generation Check:', {
      isJobBoardsEnabled,
      hasJobKeywords: form.job_keywords && form.job_keywords.length > 0,
      userId,
      autoPopulateData,
    });

    // Only generate if Job Boards is enabled, we don't have job keywords yet, and we have context or onboarding data
    // Don't regenerate if we're loading an existing form that already has keywords saved
    if (isJobBoardsEnabled && (!form.job_keywords || form.job_keywords.length === 0) && userId && !(existingForm as any)?.job_keywords?.length) {
      // Priority: 1) Auto-populate data, 2) Solution context, 3) Onboarding data (businessDetails.whatYouSell)
      const context = autoPopulateData || form.solution_context || userDetails?.businessDetails?.whatYouSell || '';

      console.log('📝 Context for keyword generation:', context ? `"${context.substring(0, 100)}..."` : 'EMPTY');

      if (context.trim()) {
        // Generate job keywords
        console.log('🚀 Starting job keyword generation...');
        LeadFormService.generateJobKeywords(userId, context)
          .then((response) => {
            if (response.status && response.responseData?.job_keywords) {
              const keywords = response.responseData.job_keywords;
              console.log(`✅ Auto-generated ${keywords.length} job keywords from ${response.responseData.source}:`, keywords);
              setForm((prev) => ({ ...prev, job_keywords: keywords }));
              triggerToast('success', `Generated ${keywords.length} job role keywords for job board search`);
            } else {
              console.error('❌ Invalid response from keyword generation:', response);
            }
          })
          .catch((error) => {
            console.error('❌ Error auto-generating job keywords:', error);
          });
      } else {
        // No context available - show helpful message
        console.warn('⚠️ No business context found. Please either:');
        console.warn('   1. Complete onboarding with "What you sell" information, OR');
        console.warn('   2. Use AI Auto-Populate to describe your solution, OR');
        console.warn('   3. Enter job keywords manually');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJobBoardsEnabled, userId, autoPopulateData]);

  // AUTO-REGENERATION: When solution context changes, regenerate keywords (unless locked)
  useEffect(() => {
    // Only auto-regenerate if:
    // 1. Job Boards is enabled
    // 2. Solution context has meaningful content
    // 3. Keywords are not locked by user
    // 4. Keywords already exist (meaning this is an update, not initial generation)
    if (isJobBoardsEnabled && debouncedSolutionContext && debouncedSolutionContext.trim().length > 10 && !keywordsLocked && form.job_keywords && form.job_keywords.length > 0 && userId) {
      console.log('🔄 Auto-regenerating keywords from updated solution context');
      setIsGeneratingKeywords(true);

      LeadFormService.generateJobKeywords(userId, debouncedSolutionContext)
        .then((response) => {
          if (response.status && response.responseData?.job_keywords) {
            const keywords = response.responseData.job_keywords;
            console.log(`✅ Regenerated ${keywords.length} job keywords:`, keywords);
            setForm((prev) => ({ ...prev, job_keywords: keywords }));

            // Visual feedback
            setKeywordsJustUpdated(true);
            setTimeout(() => setKeywordsJustUpdated(false), 2000);

            triggerToast('success', `Updated ${keywords.length} job keywords based on new context`);
          }
        })
        .catch((error) => {
          console.error('Error regenerating keywords:', error);
        })
        .finally(() => {
          setIsGeneratingKeywords(false);
        });
    }
  }, [debouncedSolutionContext, isJobBoardsEnabled, keywordsLocked, userId]);

  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      // Clear all intervals when component unmounts
      if (intervalsRef.current.tipInterval) clearInterval(intervalsRef.current.tipInterval);
      if (intervalsRef.current.progressSimulation) clearInterval(intervalsRef.current.progressSimulation);
      if (intervalsRef.current.pollInterval) clearInterval(intervalsRef.current.pollInterval);
      if (intervalsRef.current.fallbackTimeout) clearTimeout(intervalsRef.current.fallbackTimeout);
      if (intervalsRef.current.smoothProgressInterval) clearInterval(intervalsRef.current.smoothProgressInterval);
    };
  }, []);

  // Stop progress simulation when user cancels job
  useEffect(() => {
    if (isCancelling && intervalsRef.current.progressSimulation) {
      clearInterval(intervalsRef.current.progressSimulation);
      intervalsRef.current.progressSimulation = null;
    }
  }, [isCancelling]);

  // Smooth progress animation - interpolates between current and target progress
  useEffect(() => {
    // Clear any existing interval
    if (intervalsRef.current.smoothProgressInterval) {
      clearInterval(intervalsRef.current.smoothProgressInterval);
    }

    // Only animate if there's a gap between display and target
    if (fetchingProgress < targetProgress) {
      intervalsRef.current.smoothProgressInterval = setInterval(() => {
        setFetchingProgress((prev) => {
          const diff = targetProgress - prev;

          // If we've reached target, stop
          if (diff <= 0) {
            if (intervalsRef.current.smoothProgressInterval) {
              clearInterval(intervalsRef.current.smoothProgressInterval);
              intervalsRef.current.smoothProgressInterval = null;
            }
            return targetProgress;
          }

          // Exponential smoothing: move 10% of remaining distance per tick
          // This creates natural acceleration/deceleration
          const increment = Math.max(0.5, diff * 0.1);
          return Math.round(Math.min(targetProgress, prev + increment));
        });
      }, 50); // Update every 50ms for smooth 20fps animation
    } else if (fetchingProgress > targetProgress) {
      // If backend progress goes backwards (shouldn't happen), snap immediately
      setFetchingProgress(targetProgress);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalsRef.current.smoothProgressInterval) {
        clearInterval(intervalsRef.current.smoothProgressInterval);
        intervalsRef.current.smoothProgressInterval = null;
      }
    };
  }, [targetProgress, fetchingProgress]);

  // Add beforeunload warning when job is running
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFetchingLeads) {
        e.preventDefault();
        e.returnValue = 'Lead generation is in progress. If you leave, you can return to see the progress.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFetchingLeads]);

  // Check for existing job on mount and resume if found
  useEffect(() => {
    if (userId && !isFetchingLeads && !activeJobId) {
      const savedJob = getJobFromLocalStorage(userId);
      if (savedJob) {
        console.log('🔄 Resuming previous job:', savedJob.jobId);
        // Resume polling for this job
        resumeJobPolling(savedJob.jobId);
      }
    }
  }, [userId]);

  // Merge newly fetched Twitter results with previously cached ones
  const mergeTwitterResults = (prev: TwitterFetchResponseDto | null, next: TwitterFetchResponseDto): TwitterFetchResponseDto => {
    const prevTweets = prev?.responseData?.tweets ?? [];
    const nextTweets = next?.responseData?.tweets ?? [];

    // Deduplicate by URL if available, otherwise by text + created_at
    const seen = new Set<string>();
    const mergedTweets = [...prevTweets, ...nextTweets].filter((tweet) => {
      const key = tweet.url || `${tweet.text}-${tweet.created_at}`;
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      ...next,
      responseData: {
        ...next.responseData,
        tweets: mergedTweets,
        total_tweets: mergedTweets.length,
      },
    };
  };

  const convertTwitterDateToISO = (twitterDate: string): string => {
    try {
      // Twitter format: "Sun Nov 09 17:51:05 +0000 2025"
      // Convert to ISO format
      const date = new Date(twitterDate);
      return date.toISOString();
    } catch (error) {
      console.error('Error converting date:', error);
      // Fallback to current date if conversion fails
      return new Date().toISOString();
    }
  };

  const mapTweetsToLeadPayload = (tw: TwitterFetchResponseDto, assignedTo: string): LeadDto[] => {
    return (tw.responseData?.tweets ?? []).map((tweet) => ({
      first_name: tweet.author || 'Twitter User',
      last_name: '',
      username: tweet.author || '',
      mention: tweet.text,
      lead_reason: tweet.text,
      lead_status: LeadStatusEnum.NEW,
      opportunity_type: 'Other',
      tags: [],
      twitter_url: tweet.url,
      lead_link: tweet.url,
      social_profile_link: tweet.url,
      picture_url: '',
      created_date: convertTwitterDateToISO(tweet.created_at),
      last_updated: convertTwitterDateToISO(tweet.created_at),
      lead_type: LeadTypeEnum.CONVERSATIONAL,
      website_url: tweet.url ?? '',
      sentiment: tweet.sentiment,
      confidence: tweet.confidence,
      lead_source: LeadSourceEnum.X,
      assigned_to: assignedTo,
      starred: false,
    }));
  };

  const handleChange = (field: keyof ConversationalSearchFormDto, value: any) => {
    // If platform_configs changed, trigger job keyword generation
    if (field === 'platform_configs') {
      const isJobBoardsNowEnabled = value?.some((config: any) => config.platform === 'JOB_BOARDS' && config.enabled);
      console.log('📋 Platform configs changed, Job Boards enabled:', isJobBoardsNowEnabled);

      if (isJobBoardsNowEnabled && userId && userBusinessDetails) {
        // Auto-populate Job Boards-related fields from onboarding data
        const context = autoPopulateData || form.solution_context || userBusinessDetails?.whatYouSell || '';

        // Auto-populate form fields
        const updates: any = { [field]: value };

        // 1. Form Title - Make it descriptive
        if (!form.form_title || form.form_title === 'Sales Signal Form V2') {
          updates.form_title = `Job Signals - ${userBusinessDetails.businessName || 'Tech & Web3 Hiring'}`;
        }

        // 2. Solution Context - Use whatYouSell
        if (!form.solution_context && userBusinessDetails.whatYouSell) {
          updates.solution_context = userBusinessDetails.whatYouSell;
        }

        // 3. Category Context - Use industry
        if (!form.category_context && userBusinessDetails.industry) {
          updates.category_context = userBusinessDetails.industry;
        }

        // 4. Location - Use businessLocation
        if ((!form.location || form.location.length === 0) && userBusinessDetails.businessLocation) {
          updates.location = [userBusinessDetails.businessLocation];
        }

        // 5. Intent Type - Smart default
        if (!form.intent_type) {
          updates.intent_type = `Companies hiring for roles related to ${userBusinessDetails.industry || 'our services'}`;
        }

        // 6. AI Response Guide - Smart default
        if (!form.ai_response_guide) {
          updates.ai_response_guide = `Professional outreach for hiring managers in ${userBusinessDetails.industry || 'tech'} companies`;
        }

        // Apply updates first
        setForm((prev) => ({ ...prev, ...updates }));

        // 7. Job Keywords - Generate via API
        if (context.trim() && (!form.job_keywords || form.job_keywords.length === 0)) {
          LeadFormService.generateJobKeywords(userId, context)
            .then((response) => {
              if (response.status && response.responseData?.job_keywords) {
                const keywords = response.responseData.job_keywords;
                setForm((prev) => ({ ...prev, job_keywords: keywords }));
                triggerToast('success', `Auto-populated form with your business details`);
              }
            })
            .catch((error) => {
              console.error('Keyword generation error:', error);
            });
        }
      }
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to clear all intervals
  const clearAllIntervals = () => {
    if (intervalsRef.current.tipInterval) {
      clearInterval(intervalsRef.current.tipInterval);
      intervalsRef.current.tipInterval = null;
    }
    if (intervalsRef.current.progressSimulation) {
      clearInterval(intervalsRef.current.progressSimulation);
      intervalsRef.current.progressSimulation = null;
    }
    if (intervalsRef.current.pollInterval) {
      clearInterval(intervalsRef.current.pollInterval);
      intervalsRef.current.pollInterval = null;
    }
    if (intervalsRef.current.fallbackTimeout) {
      clearTimeout(intervalsRef.current.fallbackTimeout);
      intervalsRef.current.fallbackTimeout = null;
    }
  };

  // Resume polling for an existing job
  const resumeJobPolling = async (jobId: string) => {
    if (!userId) return;

    console.log('🔄 Resuming job polling for:', jobId);
    setActiveJobId(jobId);
    setIsFetchingLeads(true);
    setTargetProgress(50); // Start at 50% when resuming
    setFetchingStatus('🔄 Resuming lead generation...');

    // Setup tips rotation
    const tips = [
      "💡 Tip: Use specific keywords like 'need' instead of generic terms",
      '🎯 Did you know? Specific pain points yield better leads',
      "⚡ Pro tip: Try 'looking for recommendations' for better results",
      '🔍 Fun fact: 70% of posts are filtered out for being promotional',
    ];

    let currentTipIndex = 0;
    intervalsRef.current.tipInterval = setInterval(() => {
      setCurrentTip(tips[currentTipIndex]);
      currentTipIndex = (currentTipIndex + 1) % tips.length;
    }, 4000);
    setCurrentTip(tips[0]);

    // Start polling
    let pollAttempts = 0;
    const MAX_POLL_ATTEMPTS = 100;
    let isJobComplete = false;

    const pollJob = async () => {
      if (isJobComplete || pollAttempts >= MAX_POLL_ATTEMPTS) {
        clearAllIntervals();
        return;
      }

      pollAttempts++;

      try {
        const statusResponse = await LeadFormService.getJobStatus(jobId);

        if (statusResponse.responseCode === 200 && statusResponse.responseData) {
          const jobData = statusResponse.responseData;

          // Update progress based on REAL backend progress
          if (typeof jobData.progress === 'number') {
            setTargetProgress(jobData.progress); // Smooth animation will interpolate

            // Update status messages based on REAL progress
            if (jobData.progress < 20) {
              setFetchingStatus('🔍 Searching across social platforms...');
            } else if (jobData.progress < 50) {
              setFetchingStatus('📊 Analyzing posts for intent signals...');
            } else if (jobData.progress < 80) {
              setFetchingStatus('🎯 Filtering and scoring qualified leads...');
            } else if (jobData.progress < 100) {
              setFetchingStatus('✨ Finalizing results...');
            }
          }

          if (jobData.status === 'completed') {
            isJobComplete = true;
            clearAllIntervals();
            clearJobFromLocalStorage();
            setActiveJobId(null);

            if (jobData.stats) {
              setLeadStats(jobData.stats);
            }

            setTargetProgress(100); // Smooth transition to 100%
            setFetchingStatus('✅ Analysis complete!');

            setTimeout(() => {
              setOpenSuccessModal(true);
              triggerToast('success', jobData.message || 'Leads fetched and analyzed successfully!');
            }, 500);

            setIsFetchingLeads(false);
          } else if (jobData.status === 'cancelled') {
            isJobComplete = true;
            clearAllIntervals();
            clearJobFromLocalStorage();
            setActiveJobId(null);

            if (jobData.stats) {
              setLeadStats({ ...jobData.stats, job_cancelled: true });
            }

            setTargetProgress(100); // Smooth transition to 100%
            setFetchingStatus('🛑 Job cancelled');

            setTimeout(() => {
              setOpenSuccessModal(true);
              triggerToast('success', jobData.message || 'Job cancelled. Partial results available.');
            }, 500);

            setIsFetchingLeads(false);
          } else if (jobData.status === 'failed') {
            isJobComplete = true;
            clearAllIntervals();
            clearJobFromLocalStorage();
            setActiveJobId(null);

            triggerToast('error', jobData.error || 'Lead generation failed');
            setIsFetchingLeads(false);
          }
        }
      } catch (pollError) {
        console.error('Polling error:', pollError);
      }
    };

    // Poll immediately, then every 15 seconds
    pollJob();
    intervalsRef.current.pollInterval = setInterval(pollJob, 15000);

    // Fallback timeout: 30 minutes
    intervalsRef.current.fallbackTimeout = setTimeout(
      () => {
        if (!isJobComplete) {
          clearAllIntervals();
          clearJobFromLocalStorage();
          setActiveJobId(null);

          setTargetProgress(100); // Smooth transition to 100%
          setFetchingStatus('✅ Analysis complete!');
          setIsFetchingLeads(false);

          setTimeout(() => {
            setOpenSuccessModal(true);
            triggerToast('success', 'Lead generation completed. Check your leads list.');
          }, 500);
        }
      },
      30 * 60 * 1000
    );
  };

  // Fetch leads from backend with intent analysis
  const fetchLeadsFromPlatforms = async (leadFormId: string) => {
    if (!userId) {
      triggerToast('error', 'User ID is required');
      return;
    }

    setIsFetchingLeads(true);
    setTargetProgress(0);
    setFetchingProgress(0); // Reset display progress immediately

    // Helpful tips to rotate through
    const tips = [
      "💡 Tip: Use specific keywords like 'need' instead of generic terms",
      '🎯 Did you know? Specific pain points yield better leads',
      "⚡ Pro tip: Try 'looking for recommendations' for better results",
      '🔍 Fun fact: 70% of posts are filtered out for being promotional',
    ];

    let currentTipIndex = 0;

    // Rotate tips every 4 seconds
    intervalsRef.current.tipInterval = setInterval(() => {
      setCurrentTip(tips[currentTipIndex]);
      currentTipIndex = (currentTipIndex + 1) % tips.length;
    }, 4000);

    // Set initial state
    setCurrentTip(tips[0]);
    setFetchingStatus('🚀 Starting lead generation...');

    try {
      // Start the async job (returns immediately with job_id)
      const response = await LeadFormService.fetchConversationalLeads(leadFormId, userId);

      // Check for limit exceeded error
      if (response.responseCode === 403 && (response.responseData as any)?.limit_exceeded) {
        clearAllIntervals();
        setShowLimitExceededModal(true);
        setIsFetchingLeads(false);
        return;
      }

      if (response.responseCode !== 202) {
        throw new Error(response.responseMessage || 'Failed to start lead generation');
      }

      const jobId = response.responseData?.job_id;
      if (!jobId) {
        throw new Error('No job_id returned from server');
      }

      // Save job to localStorage for resume capability
      setActiveJobId(jobId);
      saveJobToLocalStorage(jobId, leadFormId, userId);
      console.log('💾 Saved job to localStorage:', jobId);

      // HYBRID: Simulated progress + backend polling (with retry logic)
      let simulatedProgress = 0;
      let isJobComplete = false;
      let pollAttempts = 0;

      // Dynamic timeout based on enabled platforms
      // Both social and job boards need sufficient time for fetching + AI analysis
      // Social media only: 60 attempts × 15s = 15 minutes
      // With job boards: 100 attempts × 15s = 25 minutes (job boards take longer due to Apify scraping)
      const hasJobBoardsEnabled = form.platform_configs?.some((config) => config.platform === 'JOB_BOARDS' && config.enabled) || false;
      const MAX_POLL_ATTEMPTS = hasJobBoardsEnabled ? 100 : 60;

      // Simulate smooth progress: 0% → 95% over 2 minutes
      intervalsRef.current.progressSimulation = setInterval(() => {
        if (simulatedProgress < 95 && !isJobComplete) {
          simulatedProgress += 0.79; // ~95% in 120 seconds
          setTargetProgress(Math.floor(simulatedProgress)); // Update target, smooth animation handles display

          // Update status messages based on progress
          if (simulatedProgress < 20) {
            setFetchingStatus('🔍 Searching across social platforms...');
          } else if (simulatedProgress < 50) {
            setFetchingStatus('📊 Analyzing posts for intent signals...');
          } else if (simulatedProgress < 80) {
            setFetchingStatus('🎯 Filtering and scoring qualified leads...');
          } else {
            setFetchingStatus('✨ Finalizing results...');
          }
        }
      }, 1000);

      // Poll backend every 15 seconds (restored from original)
      intervalsRef.current.pollInterval = setInterval(async () => {
        if (isJobComplete || pollAttempts >= MAX_POLL_ATTEMPTS) {
          clearAllIntervals();
          return;
        }

        pollAttempts++;

        try {
          const statusResponse = await LeadFormService.getJobStatus(jobId);

          if (statusResponse.responseCode === 200 && statusResponse.responseData) {
            const jobData = statusResponse.responseData;

            // Update with REAL backend progress (only if moving forward)
            if (typeof jobData.progress === 'number') {
              // Only update if backend progress is ahead or equal (never go backward)
              if (jobData.progress >= simulatedProgress) {
                simulatedProgress = jobData.progress; // Sync simulation with real progress
                setTargetProgress(jobData.progress); // Smooth animation will interpolate
              }
              // If backend is behind simulated progress, ignore it and let simulation continue

              // Update status based on real progress
              if (jobData.progress < 20) {
                setFetchingStatus('🔍 Searching across social platforms...');
              } else if (jobData.progress < 50) {
                setFetchingStatus('📊 Analyzing posts for intent signals...');
              } else if (jobData.progress < 80) {
                setFetchingStatus('🎯 Filtering and scoring qualified leads...');
              } else if (jobData.progress < 100) {
                setFetchingStatus('✨ Finalizing results...');
              }
            }

            if (jobData.status === 'completed') {
              isJobComplete = true;
              clearAllIntervals();
              clearJobFromLocalStorage();
              setActiveJobId(null);

              // Store the stats
              if (jobData.stats) {
                setLeadStats(jobData.stats);
              }

              // Smooth transition to 100%
              setTargetProgress(100);
              setFetchingStatus('✅ Analysis complete!');

              // Hybrid approach: Wait for animation to complete OR 2s max timeout
              const startTime = Date.now();
              const checkAnimationComplete = setInterval(() => {
                const elapsed = Date.now() - startTime;

                // Show modal if progress reached 99% OR 2 seconds passed
                if (fetchingProgress >= 99 || elapsed >= 2000) {
                  clearInterval(checkAnimationComplete);
                  setOpenSuccessModal(true);
                  triggerToast('success', jobData.message || 'Leads fetched and analyzed successfully!');
                }
              }, 100);

              // Absolute fallback: force modal after 3 seconds
              setTimeout(() => {
                clearInterval(checkAnimationComplete);
                if (!openSuccessModal) {
                  setOpenSuccessModal(true);
                  triggerToast('success', jobData.message || 'Leads fetched and analyzed successfully!');
                }
              }, 3000);

              setIsFetchingLeads(false);
            } else if (jobData.status === 'cancelled') {
              isJobComplete = true;
              clearAllIntervals();
              clearJobFromLocalStorage();
              setActiveJobId(null);

              if (jobData.stats) {
                setLeadStats({ ...jobData.stats, job_cancelled: true });
              }

              setTargetProgress(100); // Smooth transition to 100%
              setFetchingStatus('🛑 Job cancelled');

              setTimeout(() => {
                setOpenSuccessModal(true);
                triggerToast('success', jobData.message || 'Job cancelled. Partial results available.');
              }, 500);

              setIsFetchingLeads(false);
            } else if (jobData.status === 'failed') {
              isJobComplete = true;
              clearAllIntervals();
              clearJobFromLocalStorage();
              setActiveJobId(null);

              triggerToast('error', jobData.error || 'Lead generation failed');
              setIsFetchingLeads(false);
            }
          }
        } catch (pollError) {
          console.error('Polling error:', pollError);
          // Continue polling on error (don't stop on timeout)
        }
      }, 15000); // Poll every 15 seconds

      // Fallback timeout: If job never completes, show modal
      // Social only: 15 minutes, With job boards: 25 minutes
      const fallbackTimeoutMinutes = hasJobBoardsEnabled ? 25 : 15;
      intervalsRef.current.fallbackTimeout = setTimeout(
        () => {
          if (!isJobComplete) {
            clearAllIntervals();
            clearJobFromLocalStorage();
            setActiveJobId(null);

            setTargetProgress(100); // Smooth transition to 100%
            setFetchingStatus('✅ Analysis complete!');
            setIsFetchingLeads(false);

            setTimeout(() => {
              setOpenSuccessModal(true);
              triggerToast('success', 'Lead generation completed but stats unavailable. Check your leads list.');
            }, 500);
          }
        },
        fallbackTimeoutMinutes * 60 * 1000
      );
    } catch (error: any) {
      console.error('Error starting lead generation:', error);

      // Clear all intervals
      clearAllIntervals();

      // Check if this is a limit exceeded error (403 status or limit_exceeded flag)
      const is403Error = error?.response?.status === 403;
      const hasLimitExceededFlag = error?.response?.data?.limit_exceeded || error?.data?.limit_exceeded;

      if (is403Error || hasLimitExceededFlag) {
        setShowLimitExceededModal(true);
        setIsFetchingLeads(false);
        return;
      }

      triggerToast('error', error?.response?.data?.message || error?.data?.message || 'Error starting lead generation. Please try again.');
      setIsFetchingLeads(false);
      setTimeout(() => {
        setFetchingStatus('');
        setTargetProgress(0);
        setFetchingProgress(0); // Reset both immediately on error
        setCurrentTip('');
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      triggerToast('error', 'You must be logged in to create or update a lead form');
      return;
    }

    // Check if lead_generation_goal is empty
    if (!form.lead_generation_goal || form.lead_generation_goal.trim() === '') {
      setShowLeadGoalModal(true);
      return;
    }

    await proceedWithSave();
  };

  const proceedWithSave = async () => {
    // Frontend limit check removed - now handled by backend with proper validation
    // Backend will return 403 with limit_exceeded flag if user exceeds quota

    const twitterEnabled = form.platform_configs?.some((config) => config.platform === BrowsercloudPlatformEnum.TWITTER && config.enabled);
    const linkedinEnabled = false;
    const facebookEnabled = form.platform_configs?.some((config) => config.platform === BrowsercloudPlatformEnum.FACEBOOK && config.enabled);
    const tiktokEnabled = form.platform_configs?.some((config) => config.platform === BrowsercloudPlatformEnum.TIKTOK && config.enabled);

    if ((twitterEnabled || linkedinEnabled || tiktokEnabled || facebookEnabled) && (!form.keywords || form.keywords.length === 0)) {
      triggerToast('error', 'Please add at least one keyword to monitor');
      return;
    }

    // Platform fetching is now handled by background jobs on the backend
    // Leads will be fetched immediately after form save/update

    const disabledPlatforms = new Set([BrowsercloudPlatformEnum.THREADS, BrowsercloudPlatformEnum.LINKEDIN]);
    const enabledPlatforms = form.platform_configs?.filter((c) => c.enabled && !disabledPlatforms.has(c.platform as any)).map((c) => c.platform) || [];

    if (form.enable_realtime && enabledPlatforms.length === 0) {
      triggerToast('error', 'Please select at least one platform for real-time monitoring');
      return;
    }

    // Check for business-keyword mismatch (only if both social and job boards enabled)
    const hasSocialPlatforms = enabledPlatforms.some((p) => [BrowsercloudPlatformEnum.TWITTER, BrowsercloudPlatformEnum.FACEBOOK, BrowsercloudPlatformEnum.TIKTOK].includes(p as any));
    const hasJobBoards = enabledPlatforms.includes(BrowsercloudPlatformEnum.JOB_BOARDS as any);

    // Warn if job boards selected but no solution_context provided
    if (hasJobBoards && !form.solution_context?.trim()) {
      triggerToast('error', 'Job boards require "What you sell" to be filled for better lead matching. Please add your solution context.');
      return;
    }

    if (hasSocialPlatforms && hasJobBoards && !pendingSubmit) {
      // Both sources selected - validate for mismatch
      try {
        const validationResponse = await LeadFormService.validateSearchContext({
          solution_context: form.solution_context || '',
          category_context: form.category_context || '',
          social_keywords: form.keywords || [],
          job_keywords: form.job_keywords || [],
          has_social_platforms: hasSocialPlatforms,
          has_job_boards: hasJobBoards,
        });

        if (validationResponse.status && validationResponse.responseData) {
          const data = validationResponse.responseData;

          // If low match detected, show warning modal
          if (!data.is_valid && data.match_score < 0.4) {
            setMismatchData({
              match_score: data.match_score,
              reasoning: data.reasoning,
              recommendation: data.recommendation,
              suggested_social_keywords: data.suggested_social_keywords || [],
            });
            setShowMismatchModal(true);
            return; // Stop submission, wait for user decision
          }
        }
      } catch (error: any) {
        console.warn('⚠️ Validation failed, proceeding anyway:', error);
        // Fail open - if validation fails, allow submission
      }
    }

    const payload: ConversationalSearchFormDto = {
      ...form,
      enable_realtime: true,
      user_id: userId!,
      monitoring_platforms: enabledPlatforms,
    };

    if (existingFormId) {
      const updatePayload: ConversationalSearchFormDto = {
        user_id: userId || '',
        form_title: payload.form_title || '',
        intent_type: payload.intent_type || '',
        ai_response_guide: payload.ai_response_guide || '',
        keywords: payload.keywords || [],
        competitors: payload.competitors || [],
        buying_signals: payload.buying_signals || [],
        excluded_keywords: payload.excluded_keywords || [],
        add_to_history: payload.add_to_history || false,
        auto_generate: payload.auto_generate || false,
        form_type: FormTypeEnum.CONVERSATIONAL,
        enable_realtime: true,
        monitoring_platforms: payload.monitoring_platforms || [],
        platform_configs: payload.platform_configs || [],
        monitoring_interval_hours: payload.monitoring_interval_hours ?? 0, // Use ?? to preserve 0 value
        location: payload.location || [],
        post_age_filter: payload.post_age_filter || 'all',
        // CLG Upgrade fields
        category_context: payload.category_context || '',
        implied_keywords: payload.implied_keywords || [],
        scoring_thresholds: payload.scoring_thresholds,
        // Job Boards fields
        solution_context: payload.solution_context || '',
        job_keywords: payload.job_keywords || [],
        // AI Next Steps
        lead_generation_goal: payload.lead_generation_goal || '',
      };

      updateConversationalSearchLeadForm.mutate(
        { lead_form_id: existingFormId, data: updatePayload },
        {
          onSuccess: async () => {
            // setOpenSuccessModal(true);
            // Trigger sequential lead fetching after successful update
            await fetchLeadsFromPlatforms(existingFormId);
          },
          onError: (error: any) => {
            if (error?.response?.status === 403 || error?.response?.data?.limit_exceeded) {
              setShowLimitExceededModal(true);
            } else {
              triggerToast('error', error?.response?.data?.message || 'Update failed. Please try again.');
            }
          },
        }
      );
    } else {
      createConversationalSearchLeadForm.mutate(payload, {
        onSuccess: async (response) => {
          // setOpenSuccessModal(true);
          // Trigger sequential lead fetching after successful creation
          const newFormId = response?.responseData?.lead_form_id;
          if (newFormId) {
            await fetchLeadsFromPlatforms(newFormId);
          }
        },
        onError: (error: any) => {
          if (error?.response?.status === 403 || error?.response?.data?.limit_exceeded) {
            setShowLimitExceededModal(true);
          } else {
            triggerToast('error', error?.response?.data?.message || 'Creation failed. Please try again.');
          }
        },
      });
    }
  };

  // Business mismatch modal handlers
  const handleUseOnlySocial = () => {
    // Disable job boards, keep only social platforms
    setForm((prev) => ({
      ...prev,
      platform_configs:
        prev.platform_configs?.map((config) => ({
          ...config,
          enabled: config.platform !== BrowsercloudPlatformEnum.JOB_BOARDS,
        })) || [],
    }));
    setShowMismatchModal(false);
    setPendingSubmit(false);
    triggerToast('success', 'Job boards disabled. Only social platforms will be used.');
  };

  const handleUseOnlyJobBoards = () => {
    // Disable social platforms, keep only job boards
    setForm((prev) => ({
      ...prev,
      platform_configs:
        prev.platform_configs?.map((config) => ({
          ...config,
          enabled: config.platform === BrowsercloudPlatformEnum.JOB_BOARDS,
        })) || [],
    }));
    setShowMismatchModal(false);
    setPendingSubmit(true); // Continue with submission
    // Trigger submit again with updated config
    setTimeout(() => handleSubmit(), 100);
  };

  const handleUpdateSearch = () => {
    // Close modal, user will update their search manually
    setShowMismatchModal(false);
    setPendingSubmit(false);
    triggerToast('success', 'Please update your search keywords to match your business better.');
  };

  const handleContinueAnyway = () => {
    // User acknowledges mismatch but wants to proceed
    setShowMismatchModal(false);
    setPendingSubmit(true);
    // Continue with original submission
    setTimeout(() => proceedWithSubmit(), 100);
  };

  const proceedWithSubmit = async () => {
    // This is called after user confirms to continue despite mismatch
    // Re-run the actual submission logic
    const disabledPlatforms = new Set([BrowsercloudPlatformEnum.THREADS, BrowsercloudPlatformEnum.LINKEDIN]);
    const enabledPlatforms = form.platform_configs?.filter((c) => c.enabled && !disabledPlatforms.has(c.platform as any)).map((c) => c.platform) || [];

    const payload: ConversationalSearchFormDto = {
      ...form,
      enable_realtime: true,
      user_id: userId!,
      monitoring_platforms: enabledPlatforms,
    };

    if (existingFormId) {
      const updatePayload: ConversationalSearchFormDto = {
        user_id: userId!,
        form_title: payload.form_title || '',
        intent_type: payload.intent_type || '',
        ai_response_guide: payload.ai_response_guide || '',
        keywords: payload.keywords || [],
        competitors: payload.competitors || [],
        buying_signals: payload.buying_signals || [],
        excluded_keywords: payload.excluded_keywords || [],
        add_to_history: payload.add_to_history || false,
        auto_generate: payload.auto_generate || false,
        form_type: FormTypeEnum.CONVERSATIONAL,
        enable_realtime: true,
        monitoring_platforms: payload.monitoring_platforms || [],
        platform_configs: payload.platform_configs || [],
        monitoring_interval_hours: payload.monitoring_interval_hours ?? 0,
        location: payload.location || [],
        post_age_filter: payload.post_age_filter || 'all',
        category_context: payload.category_context || '',
        implied_keywords: payload.implied_keywords || [],
        scoring_thresholds: payload.scoring_thresholds,
        solution_context: payload.solution_context || '',
        job_keywords: payload.job_keywords || [],
      };

      updateConversationalSearchLeadForm.mutate(
        { lead_form_id: existingFormId, data: updatePayload },
        {
          onSuccess: async () => {
            await fetchLeadsFromPlatforms(existingFormId);
          },
          onError: (error: any) => {
            if (error?.response?.status === 403 || error?.response?.data?.limit_exceeded) {
              setShowLimitExceededModal(true);
            } else {
              triggerToast('error', error?.response?.data?.message || 'Update failed. Please try again.');
            }
          },
        }
      );
    } else {
      createConversationalSearchLeadForm.mutate(payload, {
        onSuccess: async (response) => {
          const newFormId = response?.responseData?.lead_form_id;
          if (newFormId) {
            await fetchLeadsFromPlatforms(newFormId);
          }
        },
        onError: (error: any) => {
          if (error?.response?.status === 403 || error?.response?.data?.limit_exceeded) {
            setShowLimitExceededModal(true);
          } else {
            triggerToast('error', error?.response?.data?.message || 'Creation failed. Please try again.');
          }
        },
      });
    }
    setPendingSubmit(false);
  };

  useEffect(() => {
    if (autoPopulateSuccess && autoPopulatedResponse?.responseData) {
      const data = autoPopulatedResponse.responseData as any;
      console.log('🔍 Auto-populate response data:', data);
      console.log('🔍 intent_type from response:', data.intent_type);
      console.log('🔍 ai_response_guide from response:', data.ai_response_guide);
      setForm((prev: any) => ({
        ...prev,
        form_title: data.form_title || prev.form_title,
        intent_type: data.intent_type || prev.intent_type,
        ai_response_guide: data.ai_response_guide || prev.ai_response_guide,
        keywords: data.keywords || prev.keywords,
        competitors: data.competitors || prev.competitors,
        buying_signals: data.buying_signals || prev.buying_signals,
        excluded_keywords: data.excluded_keywords || prev.excluded_keywords,
        add_to_history: data.add_to_history || prev.add_to_history,
        auto_generate: data.auto_generate || prev.auto_generate,
        form_type: data.form_type || prev.form_type,
        // CLG Upgrade fields from auto-populate
        category_context: data.category_context || prev.category_context,
        implied_keywords: data.implied_keywords || prev.implied_keywords,
        location: data.location || prev.location, // Geographic location filtering
        post_age_filter: data.post_age_filter || prev.post_age_filter, // Time range filtering
      }));
      triggerToast('success', 'Fields updated using AI-generated suggestions');
    }
  }, [autoPopulateSuccess, autoPopulatedResponse, setForm]);

  const handleAutoPopulate = () => {
    if (!userId) return;
    triggerAutoPopulate({
      user_id: userId!,
      lead_form_type: FormTypeEnum.CONVERSATIONAL,
      data: autoPopulateData,
    });
  };

  const handleCancelJob = async () => {
    if (!activeJobId) {
      triggerToast('error', 'No active job to cancel');
      return;
    }

    if (!userId) {
      triggerToast('error', 'User not authenticated');
      return;
    }

    setIsCancelling(true);
    setCancelError(null);

    try {
      console.log('🛑 Requesting cancellation for job:', activeJobId);

      const response = await LeadFormService.cancelLeadGenerationJob(activeJobId, userId);

      if (response.status) {
        triggerToast('success', 'Cancelling job... This may take 5-15 seconds');
        setShowCancelConfirmation(false);

        // Continue polling - job status will change to "cancelled"
        // The existing polling logic will handle showing final stats
      } else {
        setCancelError(response.responseMessage || 'Failed to cancel job');
        triggerToast('error', response.responseMessage || 'Failed to cancel job');
      }
    } catch (error: any) {
      console.error('Error cancelling job:', error);
      const errorMsg = error?.response?.data?.responseMessage || 'Failed to cancel job';
      setCancelError(errorMsg);
      triggerToast('error', errorMsg);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleManualRegenerateKeywords = async () => {
    if (!userId || !form.solution_context) {
      triggerToast('error', 'Please enter a solution context first');
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const response = await LeadFormService.generateJobKeywords(userId, form.solution_context);
      if (response.status && response.responseData?.job_keywords) {
        const keywords = response.responseData.job_keywords;
        setForm((prev) => ({ ...prev, job_keywords: keywords }));

        // Visual feedback
        setKeywordsJustUpdated(true);
        setTimeout(() => setKeywordsJustUpdated(false), 2000);

        triggerToast('success', `Generated ${keywords.length} fresh job keywords`);
      }
    } catch (error: any) {
      triggerToast('error', error.message || 'Failed to regenerate keywords');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const disabledPlatforms = new Set([BrowsercloudPlatformEnum.THREADS]);

  return (
    <Box sx={{ maxWidth: '950px', mx: 'auto', mt: 4 }}>
      <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', p: { xs: 3, md: 5 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>
            Sales Signal Form
          </Typography>
          <Chip
            label="V2"
            size="small"
            icon={<BoltIcon sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontWeight: 600,
              fontSize: '11px',
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280', mb: 3 }}>
          {existingFormId ? 'Edit your existing form with real-time monitoring' : 'Create a real-time lead generation form'}
          <EditOutlinedIcon sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle', color: '#9ca3af' }} />
        </Typography>

        {/* Real-time Toggle */}
        <Alert severity="info" sx={{ mb: 3, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e40af', mb: 0.5 }}>
                Real-time Lead Detection (V2)
              </Typography>
              <Typography variant="caption" sx={{ color: '#3b82f6' }}>
                Get instant notifications when leads appear across social platforms.
              </Typography>
            </Box>
            <FormControlLabel control={<Switch checked color="primary" disabled />} label="" />
          </Box>
        </Alert>

        {/* Monitoring Interval Selector */}
        <Box sx={{ mb: 3, maxWidth: '600px' }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Monitoring Frequency
            <Tooltip title="Choose how often to check for new leads. Select 'One-time only' for a single search, or set a recurring interval. You can also enter a custom interval in hours.">
              <Box component="span" sx={{ display: 'inline-flex', cursor: 'help' }}>
                ⓘ
              </Box>
            </Tooltip>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControl sx={{ flex: '1 1 65%', maxWidth: '400px' }}>
              <Select
                id="monitoring-interval"
                value={form.monitoring_interval_hours || 0}
                onChange={(e) => handleChange('monitoring_interval_hours', Number(e.target.value))}
                displayEmpty
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9333EA',
                  },
                }}
              >
                <MenuItem value={0}>One-time only (No recurring monitoring)</MenuItem>
                <MenuItem value={1}>Every Hour (Fastest)</MenuItem>
                <MenuItem value={2}>Every 2 Hours</MenuItem>
                <MenuItem value={3}>Every 3 Hours</MenuItem>
                <MenuItem value={6}>Every 6 Hours</MenuItem>
                <MenuItem value={12}>Every 12 Hours</MenuItem>
                <MenuItem value={24}>Once Daily</MenuItem>
                <MenuItem value={48}>Every 2 Days</MenuItem>
                <MenuItem value={72}>Every 3 Days</MenuItem>
                <MenuItem value={120}>Every 5 Days</MenuItem>
                <MenuItem value={168}>Once Weekly</MenuItem>
                <MenuItem value={-1}>Custom Interval →</MenuItem>
              </Select>
            </FormControl>

            {/* Custom Interval Input - Only show if "Custom" is selected */}
            {form.monitoring_interval_hours === -1 && (
              <Box sx={{ flex: '0 0 180px' }}>
                <SingleFieldInput
                  label=""
                  placeholder="Enter hours (e.g., 28)"
                  value={form.monitoring_interval_hours === -1 ? '' : String(form.monitoring_interval_hours)}
                  setValue={(val) => {
                    const numVal = parseInt(val) || 1;
                    handleChange('monitoring_interval_hours', numVal > 0 ? numVal : 1);
                  }}
                  required={false}
                />
              </Box>
            )}
          </Box>

          {/* Helper text based on selection */}
          <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
            {form.monitoring_interval_hours === 0 && '✨ Lead generation will run once and stop. Perfect for one-time searches.'}
            {form.monitoring_interval_hours === 1 && '⚡ Recommended for time-sensitive leads. Checks every hour.'}
            {form.monitoring_interval_hours !== undefined &&
              form.monitoring_interval_hours > 1 &&
              form.monitoring_interval_hours < 24 &&
              `🔄 Checks every ${form.monitoring_interval_hours} hours for new leads.`}
            {form.monitoring_interval_hours !== undefined &&
              form.monitoring_interval_hours >= 24 &&
              form.monitoring_interval_hours < 168 &&
              `📅 Checks every ${Math.round(form.monitoring_interval_hours / 24)} day(s) for new leads.`}
            {form.monitoring_interval_hours !== undefined && form.monitoring_interval_hours >= 168 && `📆 Checks every ${Math.round(form.monitoring_interval_hours / 168)} week(s) for new leads.`}
            {form.monitoring_interval_hours === -1 && '⚙️ Enter your custom interval in hours.'}
          </Typography>
        </Box>

        {/* Form Title */}
        <Box className="tour-form-fields">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="Form Title"
              tooltip="Give your form a name to help you identify it later. This will be displayed in the lead generation dashboard."
              placeholder="Form Title"
              value={form.form_title || ''}
              setValue={(val) => handleChange('form_title', val)}
              required
            />
          </Box>

          {/* AI Form Completion Section */}
          <Box my={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#4b5563' }}>
                Want help completing this form?
              </Typography>
              <SmartToyOutlinedIcon sx={{ fontSize: 20, color: '#6b7280' }} />
            </Box>

            <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block' }}>
              Type what you're trying to achieve and let AI auto-fill the form. Example: "Find startup founders in Berlin working in fintech."
            </Typography>

            {!isEditingAIInput && (
              <Tooltip title="Use AI to complete form">
                <IconButton
                  onClick={() => setIsEditingAIInput(true)}
                  size="small"
                  sx={{
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    height: 36,
                    mb: 1,
                  }}
                >
                  <HiPencil size={18} />
                </IconButton>
              </Tooltip>
            )}

            <AnimatedSendInput
              isEditing={isEditingAIInput}
              setIsEditing={setIsEditingAIInput}
              inputValue={autoPopulateData}
              onChange={setAutoPopulateData}
              onSend={handleAutoPopulate}
              loading={isAutoPopulating}
              placeholder="Describe what you want to find or monitor across platforms..."
            />
          </Box>

          {/* Platform Selection (V2) */}
          {form.enable_realtime && (
            <Box sx={{ mb: 4 }}>
              <PlatformSelector platformConfigs={form.platform_configs || []} setPlatformConfigs={(configs) => handleChange('platform_configs', configs)} />
            </Box>
          )}

          {/* Solution Context (Job Boards) - Show only if Job Boards is selected */}
          {form.platform_configs?.some((config) => config.platform === 'JOB_BOARDS' && config.enabled) && (
            <>
              <Box sx={{ mb: 3 }}>
                <SingleFieldInput
                  label="Solution Context"
                  tooltip="Describe your product/service. Job keywords will auto-generate as you type."
                  placeholder="e.g., 'We provide cloud infrastructure that reduces DevOps costs'"
                  value={form.solution_context || ''}
                  setValue={(val) => handleChange('solution_context', val)}
                  required={false}
                />

                {/* Loading indicator when generating keywords */}
                {isGeneratingKeywords && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="primary">
                      Generating job keywords...
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Job Keywords - Auto-generated from solution context */}
              <Box
                sx={{
                  mb: 3,
                  position: 'relative',
                  border: keywordsJustUpdated ? '2px solid #4caf50' : 'none',
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  p: keywordsJustUpdated ? 1 : 0,
                }}
              >
                {/* Relationship indicator and controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontSize="13px">
                    🤖 Auto-generated from solution context above
                  </Typography>

                  <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                    {/* Lock button */}
                    <Tooltip title={keywordsLocked ? 'Keywords locked. Click to enable auto-regeneration' : 'Lock keywords to prevent auto-updates'}>
                      <IconButton
                        size="small"
                        onClick={() => setKeywordsLocked(!keywordsLocked)}
                        sx={{
                          p: 0.5,
                          color: '#CD1B78',
                          '&:hover': { bgcolor: 'rgba(205, 27, 120, 0.08)' },
                        }}
                      >
                        {keywordsLocked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>

                    {/* Manual regenerate button */}
                    <Tooltip title="Manually regenerate from current solution context">
                      <IconButton
                        size="small"
                        onClick={handleManualRegenerateKeywords}
                        disabled={!form.solution_context || isGeneratingKeywords}
                        sx={{
                          p: 0.5,
                          color: '#CD1B78',
                          '&:hover': { bgcolor: 'rgba(205, 27, 120, 0.08)' },
                          '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.26)' },
                        }}
                      >
                        <AutorenewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <ListValuesInput
                  label="Job Role Keywords"
                  tooltip="These keywords are automatically generated from your solution context. You can edit or lock them."
                  placeholder="e.g. 'DevOps Engineer', 'Cloud Architect', 'Platform Engineer'"
                  keywords={form.job_keywords || []}
                  setKeywords={(val) => handleChange('job_keywords', val)}
                />

                {/* Updated badge */}
                {keywordsJustUpdated && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      bgcolor: '#4caf50',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    ✨ Updated!
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Category Context (CLG Upgrade) */}
          <Box sx={{ mb: 3 }}>
            <SingleFieldInput
              label="Category Context"
              tooltip="The industry or category for intent analysis. This helps AI understand the domain and detect implied buying signals. E.g., 'skincare', 'fintech', 'construction materials'"
              placeholder="e.g. 'skincare', 'project management software', 'construction materials'"
              value={form.category_context || ''}
              setValue={(val) => handleChange('category_context', val)}
              required={false}
            />
          </Box>

          {/* Keywords and Excluded Keywords */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
              <ListValuesInput
                label="Keywords"
                tooltip="Direct search terms people use when looking to buy. E.g., 'buy moisturizer', 'need CRM', 'looking for cement'"
                placeholder="e.g. 'Construction', 'Cement', 'Dangote', 'Real Estate', 'Renovation'"
                keywords={form.keywords || []}
                setKeywords={(val) => handleChange('keywords', val)}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
              <ListValuesInput
                label="Implied Keywords"
                tooltip="Indirect signals that suggest buying intent through problems, situations, or lifestyle changes. E.g., 'harmattan', 'dry skin', 'project delays', 'team burnout'"
                placeholder="e.g. 'harmattan', 'dry skin', 'missing deadlines', 'scaling issues'"
                keywords={form.implied_keywords || []}
                setKeywords={(val) => handleChange('implied_keywords', val)}
              />
            </Box>
          </Box>

          {/* Excluded Keywords */}
          <Box sx={{ mb: 3 }}>
            <ListValuesInput
              label="Excluded Keywords"
              tooltip="Keywords to filter out noise and spam from your results."
              placeholder="e.g. 'spam', 'ad', 'promotion'"
              keywords={form.excluded_keywords || []}
              setKeywords={(val) => handleChange('excluded_keywords', val)}
            />
          </Box>

          {/* Competitors and Buying Signals */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
              <ListValuesInput
                label="Competitors"
                tooltip="The competitors you want to be noted for in the conversations. This can include positive or negative mentions that you can leverage for your sales and marketing efforts."
                keywords={form.competitors || []}
                setKeywords={(val) => handleChange('competitors', val)}
                placeholder="e.g. 'Bamburi Cement', 'Lafarge Africa'"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
              <ListValuesInput
                label="Buying Signals"
                tooltip="This helps the AI to analyze the conversations and understand what can trigger a purchase, collaboration, partnership or decision to buy from you or engage with you. Be specific about the type of buying signal you want to track."
                keywords={form.buying_signals || []}
                setKeywords={(val) => handleChange('buying_signals', val)}
                placeholder="e.g. 'People talking about Cement'"
              />
            </Box>
          </Box>

          {/* Intent Type and AI Response Guide */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
              <SingleFieldInput
                label="Intent Type"
                tooltip="This helps the AI to understand the context of the kind of leads you need to generate. i.e companies in wholesale or retail, industrial companies, etc."
                placeholder="e.g. 'Sell to construction companies'"
                value={form.intent_type || ''}
                setValue={(val) => handleChange('intent_type', val)}
                required={false}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
              <SingleFieldInput
                label="AI Response Guide"
                tooltip="How should Dera AI compose your leads follow up messages?"
                placeholder="e.g. 'Respond like a Construction Salesperson'"
                value={form.ai_response_guide || ''}
                setValue={(val) => handleChange('ai_response_guide', val)}
                required={false}
              />
            </Box>
          </Box>

          {/* Location and Time Range Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3, alignItems: 'start' }}>
            <ListValuesInput
              label="Location Filter"
              tooltip="Filter leads by location. Only leads from these locations will be shown. Leave empty for all locations."
              placeholder="e.g. 'Lagos', 'Nigeria', 'Ghana'"
              keywords={form.location || []}
              setKeywords={(val) => handleChange('location', val)}
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                Post Age Filter
                <Tooltip title="Filter leads by how recent the posts are. Only posts within the selected timeframe will be shown.">
                  <Box component="span" sx={{ display: 'inline-flex', cursor: 'help' }}>
                    ⓘ
                  </Box>
                </Tooltip>
              </Typography>
              <FormControl fullWidth>
                <Select
                  id="post-age-filter"
                  value={form.post_age_filter || 'all'}
                  onChange={(e) => handleChange('post_age_filter', e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9333EA',
                    },
                  }}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="24h">Last 24 Hours</MenuItem>
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="3m">Last 3 Months</MenuItem>
                  <MenuItem value="6m">Last 6 Months</MenuItem>
                  <MenuItem value="1y">Last 1 Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Lead Generation Goal - Positioned before checkboxes */}
          <Box ref={leadGoalRef} sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#374151', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              What's your goal with these leads? (Optional)
              <Tooltip
                title="Tell us your business objective. AI will use this to generate personalized next steps for each lead. Example: 'I want to sell productivity tools to startup founders'"
                arrow
              >
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: '#9ca3af' }} />
              </Tooltip>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={1}
              placeholder="e.g., I want to recruit software engineers for my startup"
              value={form.lead_generation_goal || ''}
              onChange={(e) => handleChange('lead_generation_goal', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#FAFBFC',
                },
              }}
            />
          </Box>

          {/* Checkboxes */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 3, mb: 3 }}>
            <Box mt={3.5} sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                label="Add to history"
                checked={form.add_to_history || false}
                onChange={(val) => handleChange('add_to_history', val)}
                tooltip="Check this if you want to add the form to your history. This will add the form to your history so you can easily find it later."
              />
            </Box>
          </Box>
        </Box>

        {/* Progress Indicator */}
        {isFetchingLeads && (
          <Box
            sx={{
              mb: 3,
              p: 3,
              bgcolor: isCancelling ? '#fff3e0' : '#f8f9ff',
              borderRadius: 2,
              border: isCancelling ? '1px solid #ff9800' : '1px solid #e0e7ff',
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: isCancelling ? '#e65100' : '#1e293b' }}>
                {isCancelling ? '🛑 Cancelling... Job will stop shortly' : fetchingStatus}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: isCancelling ? '#f57c00' : '#CD1B78' }}>
                {fetchingProgress}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={fetchingProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: isCancelling ? '#ffe0b2' : '#e0e7ff',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: isCancelling ? '#ff9800' : '#CD1B78',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
                },
              }}
            />

            {isCancelling ? (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#fff8e1',
                  borderRadius: 1.5,
                  border: '1px solid #ffb74d',
                }}
              >
                <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500, mb: 0.5 }}>
                  ⏳ Cancellation in progress
                </Typography>
                <Typography variant="caption" sx={{ color: '#5a5a5a', display: 'block' }}>
                  The worker will finish processing the current keyword and stop gracefully. This typically takes 5-15 seconds.
                </Typography>
              </Box>
            ) : (
              currentTip && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 1.5,
                    border: '1px solid #e0e7ff',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic' }}>
                    {currentTip}
                  </Typography>
                </Box>
              )
            )}

            {/* Cancel Button */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setShowCancelConfirmation(true)}
                disabled={isCancelling}
                startIcon={isCancelling ? <CircularProgress size={16} /> : null}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    borderColor: '#c62828',
                    backgroundColor: '#ffebee',
                  },
                }}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Generation'}
              </Button>

              {cancelError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  {cancelError}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Submit Button */}
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <LoadingButton
              className="tour-generate-btn"
              onClick={handleSubmit}
              loading={createConversationalSearchLeadForm.isLoading || updateConversationalSearchLeadForm.isLoading || isFetchingLeads}
              text={existingFormId ? 'Save Update' : 'Save'}
              loadingText={isFetchingLeads ? fetchingStatus : 'Saving...'}
              startIcon={<SaveIcon />}
            />

            <Button
              variant="outlined"
              onClick={() => router.push('/leads-tracking/forms/leads?type=conversational')}
              sx={{
                borderColor: '#CD1B78',
                color: '#CD1B78',
                '&:hover': {
                  borderColor: '#b31665',
                  backgroundColor: 'rgba(205, 27, 120, 0.04)',
                },
                px: 8,
                py: 2,
                borderRadius: 3,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                height: 50,
                minWidth: 245,
              }}
            >
              View Leads
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: '#6b7280', mt: 2, display: 'block' }}>
            {isFetchingLeads
              ? fetchingStatus
              : existingFormId
                ? 'Update your saved form details'
                : form.enable_realtime
                  ? 'Start monitoring for leads in real-time across selected platforms'
                  : 'Click to start searching for candidates matching your criteria'}
          </Typography>
        </Box>
      </Box>

      {/* Success Modal */}
      <SmartModal
        open={openSuccessModal}
        image={<Image src="/assets/images/success.png" alt="Success" width={64} height={64} />}
        mainText={leadStats?.job_cancelled ? 'Search Stopped' : leadStats && leadStats.new_leads_saved === 0 ? 'Analysis Complete' : 'Success! 🎉'}
        subText={
          leadStats
            ? (() => {
                const hasSocial = (leadStats.social_total_fetched || 0) > 0;
                const hasJobBoards = (leadStats.job_signals_found || 0) > 0;

                if (leadStats.job_cancelled) {
                  return `Your lead search was stopped early. Here's what we found:`;
                }

                if (leadStats.new_leads_saved === 0) {
                  if (leadStats.total_fetched > 0) {
                    return `No relevant leads found. Analyzed ${leadStats.total_fetched} post${leadStats.total_fetched > 1 ? 's' : ''} across selected platforms. Try adjusting your keywords or criteria for better results.`;
                  }
                  return 'No posts found matching your keywords. Try using different or broader keywords.';
                }

                // BOTH social + job boards
                if (hasSocial && hasJobBoards) {
                  return `Found ${leadStats.new_leads_saved} total leads from multiple sources`;
                }

                // ONLY social platforms
                if (hasSocial && !hasJobBoards) {
                  return `Found ${leadStats.social_new_leads || leadStats.new_leads_saved} relevant lead${(leadStats.social_new_leads || leadStats.new_leads_saved) > 1 ? 's' : ''} from ${leadStats.social_total_fetched || 0} post${(leadStats.social_total_fetched || 0) > 1 ? 's' : ''} analyzed across social platforms.`;
                }

                // ONLY job boards
                if (!hasSocial && hasJobBoards) {
                  return `Found ${leadStats.job_signals_saved || leadStats.new_leads_saved} hiring signal${(leadStats.job_signals_saved || leadStats.new_leads_saved) > 1 ? 's' : ''} from ${leadStats.job_boards_total_fetched || 0} job posting${(leadStats.job_boards_total_fetched || 0) > 1 ? 's' : ''} analyzed.`;
                }

                // Fallback
                return `Found ${leadStats.new_leads_saved} relevant lead${leadStats.new_leads_saved > 1 ? 's' : ''} from ${leadStats.total_fetched} post${leadStats.total_fetched > 1 ? 's' : ''} analyzed.`;
              })()
            : form.enable_realtime
              ? 'Your form has been successfully saved. You should see your leads in a few minutes'
              : 'Your form was successfully saved.'
        }
        buttonText="View Leads"
        onClick={() => {
          setOpenSuccessModal(false);
          setLeadStats(null);
          router.push('/leads-tracking/forms/leads?type=conversational');
        }}
        onOutlineButtonClick={() => {
          setOpenSuccessModal(false);
          setLeadStats(null);
        }}
        outlineButtonText="Close"
      >
        {leadStats &&
          (() => {
            const hasSocial = (leadStats.social_total_fetched || 0) > 0;
            const hasJobBoards = (leadStats.job_signals_found || 0) > 0;

            return (
              <Box sx={{ mt: 3, width: '100%', maxWidth: hasSocial && hasJobBoards ? '600px' : '400px' }}>
                {/* BOTH social + job boards: Show breakdown */}
                {hasSocial && hasJobBoards && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Social Platforms Box */}
                    <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: '12px', border: '1px solid #90caf9' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        🔵 Social Platforms
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                            {leadStats.social_new_leads || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            New Leads
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                            {leadStats.social_total_fetched || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            Posts Analyzed
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#43a047' }}>
                            {leadStats.social_qualified || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            Qualified
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Job Boards Box */}
                    <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: '12px', border: '1px solid #81c784' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        💼 Job Board Signals
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#388e3c' }}>
                            {leadStats.job_signals_saved || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            Signals Saved
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                            {leadStats.job_boards_total_fetched || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            Jobs Analyzed
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                            {leadStats.job_signals_found || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            Qualified
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f57c00' }}>
                            {(leadStats.job_signals_high_match || 0) + (leadStats.job_signals_medium_match || 0)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#5a5a5a', fontSize: '10px' }}>
                            Strong+Medium
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* ONLY social OR ONLY job boards: Show standard grid */}
                {(hasSocial && !hasJobBoards) || (!hasSocial && hasJobBoards) ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2,
                      p: 3,
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#CD1B78', mb: 0.5 }}>
                        {leadStats.new_leads_saved}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                        New Leads
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#495057', mb: 0.5 }}>
                        {hasJobBoards ? leadStats.job_boards_total_fetched || 0 : leadStats.total_fetched}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                        {hasJobBoards ? 'Jobs Analyzed' : 'Posts Analyzed'}
                      </Typography>
                    </Box>
                    {leadStats.total_qualified > 0 && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#17a2b8', mb: 0.5 }}>
                          {leadStats.total_qualified}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                          Qualified
                        </Typography>
                      </Box>
                    )}
                    {hasJobBoards && (leadStats.job_signals_high_match || 0) > 0 && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#28a745', mb: 0.5 }}>
                          {leadStats.job_signals_high_match}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                          Strong Match
                        </Typography>
                      </Box>
                    )}
                    {leadStats.duplicates_skipped > 0 && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffc107', mb: 0.5 }}>
                          {leadStats.duplicates_skipped}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                          Duplicates Skipped
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : null}
              </Box>
            );
          })()}

        {/* Unqualified Leads CTA - Show only if leads were analyzed */}
        {leadStats && (leadStats.total_fetched > 0 || leadStats.total_qualified > 0) && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              border: '1px solid #ffb74d',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500, mb: 0.5 }}>
              💡 Want to review filtered-out leads?
            </Typography>
            <Typography variant="caption" sx={{ color: '#5a5a5a', display: 'block', mb: 1 }}>
              View unqualified leads that didn't meet your criteria
            </Typography>
            <Box
              component="a"
              href="/leads-tracking/forms/leads?type=conversational&active_tab=unqualified&page=1"
              sx={{
                color: '#f57c00',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Go to Unqualified Tab →
            </Box>
          </Box>
        )}
      </SmartModal>

      {/* Limit Exceeded Modal */}
      <LimitExceededModal
        isOpen={showLimitExceededModal}
        onClose={() => setShowLimitExceededModal(false)}
        featureType="lead"
        currentUsage={featureLimit?.lead?.noOfLeads?.count ?? 0}
        limit={featureLimit?.lead?.noOfLeads?.limit ?? 0}
        planName={subscriptionPlanType ?? 'your current plan'}
      />

      {/* Business Mismatch Warning Modal */}
      {mismatchData && (
        <BusinessMismatchWarningModal
          open={showMismatchModal}
          onClose={() => setShowMismatchModal(false)}
          businessSolution={form.solution_context || ''}
          socialSearch={form.category_context || form.keywords?.join(', ') || ''}
          matchScore={mismatchData.match_score}
          reasoning={mismatchData.reasoning}
          recommendation={mismatchData.recommendation}
          suggestedKeywords={mismatchData.suggested_social_keywords}
          onUseOnlySocial={handleUseOnlySocial}
          onUseOnlyJobBoards={handleUseOnlyJobBoards}
          onUpdateSearch={handleUpdateSearch}
          onContinueAnyway={handleContinueAnyway}
        />
      )}

      {/* Lead Goal Reminder Modal */}
      <SmartModal
        open={showLeadGoalModal}
        onClose={() => {
          // X button: Just close modal, don't save
          setShowLeadGoalModal(false);
        }}
        image={<Box sx={{ fontSize: 48 }}>🎯</Box>}
        mainText="Add Your Lead Goal?"
        subText="Providing your lead generation goal helps our AI generate personalized, actionable next steps for each lead—making your outreach more effective."
        handleAction={() => {
          setShowLeadGoalModal(false);
          leadGoalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            const textField = leadGoalRef.current?.querySelector('textarea');
            if (textField) {
              textField.focus();
              textField.style.border = '2px solid #CD1B78';
              textField.style.boxShadow = '0 0 0 3px rgba(205, 27, 120, 0.1)';
              setTimeout(() => {
                textField.style.border = '';
                textField.style.boxShadow = '';
              }, 3000);
            }
          }, 500);
        }}
        actionText="Add Lead Goal"
        handleCancel={async () => {
          // "Continue Without Goal" button: Close and proceed with save
          setShowLeadGoalModal(false);
          await proceedWithSave();
        }}
        cancelText="Continue Without Goal"
      />

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelConfirmation} onClose={() => setShowCancelConfirmation(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Cancel Lead Generation?</Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to cancel this lead generation job?
          </Typography>

          <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              What happens when you cancel:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <Typography variant="caption">Job will stop within 5-15 seconds</Typography>
              </li>
              <li>
                <Typography variant="caption">You'll receive partial results (leads collected so far)</Typography>
              </li>
              <li>
                <Typography variant="caption">You'll only be charged for posts actually fetched and analyzed</Typography>
              </li>
            </ul>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Current progress: {fetchingProgress}% ({fetchingStatus})
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowCancelConfirmation(false)} disabled={isCancelling}>
            Continue Generation
          </Button>
          <Button onClick={handleCancelJob} color="error" variant="contained" disabled={isCancelling} startIcon={isCancelling ? <CircularProgress size={16} color="inherit" /> : null}>
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConversationLeadFormV2;
