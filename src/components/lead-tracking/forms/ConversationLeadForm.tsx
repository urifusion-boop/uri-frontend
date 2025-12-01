import { LeadsService as LeadFormService } from '@/api/LeadFormService';
import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import CustomCheckbox from '@/components/input/CustomCheckbox';
import ListValuesInput from '@/components/input/ListValuesInput';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import SmartModal from '@/components/modals/SmartModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { ConversationalSearchFormDto } from '@/models/dtos/LeadFormDto';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { BrowsercloudPlatformEnum } from '@/models/enum-models/BrowsercloudPlatformEnum';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import BoltIcon from '@mui/icons-material/Bolt';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/Save';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Alert, Box, Button, Chip, FormControlLabel, IconButton, LinearProgress, Switch, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import PlatformSelector from '../PlatformSelector';

const ConversationLeadFormV2 = () => {
  const [form, setForm] = useState<ConversationalSearchFormDto>({
    user_id: '',
    form_title: 'Conversational Lead Form V2',
    ai_response_guide: '',
    keywords: [],
    competitors: [],
    intent_type: '',
    buying_signals: [],
    excluded_keywords: [],
    add_to_history: false,
    auto_generate: false,
    form_type: '',
    enable_realtime: true, // V2 default
    monitoring_platforms: [],
    platform_configs: [],
    // CLG Upgrade fields
    category_context: '',
    implied_keywords: [],
    scoring_thresholds: {
      intent_score_min: 0.55,
      relevance_score_min: 0.5,
      final_score_min: 0.6,
    },
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [isFetchingLeads, setIsFetchingLeads] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState<string>('');
  const [fetchingProgress, setFetchingProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState('');
  const [leadStats, setLeadStats] = useState<{
    total_fetched: number;
    total_qualified: number;
    new_leads_saved: number;
    duplicates_skipped: number;
  } | null>(null);

  const { autoPopulateLeadForm, isAutoPopulating } = useLeadFormHooks();
  const [autoPopulateData, setAutoPopulateData] = useState('');
  const [isEditingAIInput, setIsEditingAIInput] = useState(false);

  const { mutate: triggerAutoPopulate, data: autoPopulatedResponse, isSuccess: autoPopulateSuccess } = autoPopulateLeadForm;
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const { userDetails } = useAuth();
  const userId = userDetails?.userId;

  const { createConversationalSearchLeadForm, updateConversationalSearchLeadForm, useGetExistingFormType } = useLeadFormHooks();

  const { data: existingForm, isSuccess } = useGetExistingFormType(userId || '', FormTypeEnum.CONVERSATIONAL);

  useEffect(() => {
    console.log('existingForm', existingForm);
    if (existingForm && isSuccess && userId) {
      const { form_title, intent_type, buying_signals, excluded_keywords, ai_response_guide, keywords, competitors, lead_form_id, add_to_history, auto_generate, form_type } = existingForm;

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
        enable_realtime: true,
        monitoring_platforms: (existingForm as any).monitoring_platforms || [],
        platform_configs: (existingForm as any).platform_configs || [],
        // CLG Upgrade fields
        category_context: (existingForm as any).category_context || '',
        implied_keywords: (existingForm as any).implied_keywords || [],
        scoring_thresholds: (existingForm as any).scoring_thresholds || {
          intent_score_min: 0.55,
          relevance_score_min: 0.5,
          final_score_min: 0.6,
        },
      });

      setExistingFormId(lead_form_id);
    }
  }, [existingForm, isSuccess, userId]);

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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch leads from backend with intent analysis
  const fetchLeadsFromPlatforms = async (leadFormId: string) => {
    if (!userId) {
      triggerToast('error', 'User ID is required');
      return;
    }

    setIsFetchingLeads(true);
    setFetchingProgress(0);

    // Helpful tips to rotate through
    const tips = [
      "💡 Tip: Use specific keywords like 'need' instead of generic terms",
      '🎯 Did you know? Specific pain points yield better leads',
      "⚡ Pro tip: Try 'looking for recommendations' for better results",
      '🔍 Fun fact: 70% of posts are filtered out for being promotional',
    ];

    // Status messages progression
    const statusMessages = [
      { msg: '🔍 Scanning social media platforms...', progress: 10 },
      { msg: '📥 Fetching posts from selected platforms...', progress: 25 },
      { msg: '🤖 AI is analyzing posts for intent...', progress: 40 },
      { msg: '✨ Validating lead quality and relevance...', progress: 60 },
      { msg: '🎯 Filtering and scoring results...', progress: 75 },
      { msg: '🏁 Almost done! Finalizing results...', progress: 90 },
    ];

    let currentTipIndex = 0;
    let currentStatusIndex = 0;

    // Rotate tips every 4 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(tips[currentTipIndex]);
      currentTipIndex = (currentTipIndex + 1) % tips.length;
    }, 4000);

    // Progress status messages
    const statusInterval = setInterval(() => {
      if (currentStatusIndex < statusMessages.length) {
        setFetchingStatus(statusMessages[currentStatusIndex].msg);
        setFetchingProgress(statusMessages[currentStatusIndex].progress);
        currentStatusIndex++;
      }
    }, 3000);

    // Set initial state
    setCurrentTip(tips[0]);
    setFetchingStatus(statusMessages[0].msg);

    try {
      // Call backend endpoint that handles platform fetching + intent analysis
      const response = await LeadFormService.fetchConversationalLeads(leadFormId, userId);

      clearInterval(tipInterval);
      clearInterval(statusInterval);

      // Complete progress
      setFetchingProgress(100);
      setFetchingStatus('✅ Analysis complete!');

      if (response.responseCode === 200) {
        // Store the stats from the response
        if (response.responseData?.stats) {
          setLeadStats(response.responseData.stats);
        }

        setTimeout(() => {
          setOpenSuccessModal(true);
          triggerToast('success', 'Leads fetched and analyzed successfully!');
        }, 500);
      } else {
        triggerToast('error', response.responseMessage || 'Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      clearInterval(tipInterval);
      clearInterval(statusInterval);
      triggerToast('error', 'Error fetching leads. The analysis may have taken too long. Please try again.');
    } finally {
      setIsFetchingLeads(false);
      setTimeout(() => {
        setFetchingStatus('');
        setFetchingProgress(0);
        setCurrentTip('');
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      triggerToast('error', 'You must be logged in to create or update a lead form');
      return;
    }

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

    const payload: ConversationalSearchFormDto = {
      ...form,
      enable_realtime: true,
      user_id: userId,
      monitoring_platforms: enabledPlatforms,
    };

    if (existingFormId) {
      const updatePayload: ConversationalSearchFormDto = {
        user_id: userId,
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
        // CLG Upgrade fields
        category_context: payload.category_context || '',
        implied_keywords: payload.implied_keywords || [],
        scoring_thresholds: payload.scoring_thresholds,
      };

      updateConversationalSearchLeadForm.mutate(
        { lead_form_id: existingFormId, data: updatePayload },
        {
          onSuccess: async () => {
            // setOpenSuccessModal(true);
            // Trigger sequential lead fetching after successful update
            await fetchLeadsFromPlatforms(existingFormId);
          },
          onError: () => {
            triggerToast('error', 'Update failed. Please try again.');
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
        onError: () => {
          triggerToast('error', 'Creation failed. Please try again.');
        },
      });
    }
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
      }));
      triggerToast('success', 'Fields updated using AI-generated suggestions');
    }
  }, [autoPopulateSuccess, autoPopulatedResponse, setForm]);

  const handleAutoPopulate = () => {
    if (!userId) return;
    triggerAutoPopulate({
      user_id: userId,
      lead_form_type: FormTypeEnum.CONVERSATIONAL,
      data: autoPopulateData,
    });
  };

  const disabledPlatforms = new Set([BrowsercloudPlatformEnum.THREADS]);

  return (
    <Box sx={{ maxWidth: '950px', mx: 'auto', mt: 4 }}>
      <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', p: { xs: 3, md: 5 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>
            Conversational Lead Form
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

          {/* Checkboxes */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box mt={3.5} sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                label="Add to history"
                checked={form.add_to_history || false}
                onChange={(val) => handleChange('add_to_history', val)}
                tooltip="Check this if you want to add the form to your history. This will add the form to your history so you can easily find it later."
              />
            </Box>

            <Box mt={3.5} sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                label="Auto-generate"
                checked={form.auto_generate || false}
                onChange={(val) => handleChange('auto_generate', val)}
                tooltip="Check this if you want to auto-generate the form. This will auto-generate the form with the data from the backend."
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
              bgcolor: '#f8f9ff',
              borderRadius: 2,
              border: '1px solid #e0e7ff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {fetchingStatus}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#CD1B78' }}>
                {fetchingProgress}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={fetchingProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e7ff',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: '#CD1B78',
                },
              }}
            />

            {currentTip && (
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
            )}
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
        mainText={leadStats && leadStats.new_leads_saved === 0 ? 'Analysis Complete' : 'Success! 🎉'}
        subText={
          leadStats
            ? leadStats.new_leads_saved > 0
              ? `Found ${leadStats.new_leads_saved} relevant lead${leadStats.new_leads_saved > 1 ? 's' : ''} out of ${leadStats.total_fetched} post${leadStats.total_fetched > 1 ? 's' : ''} analyzed across selected platforms.`
              : leadStats.total_fetched > 0
                ? `No relevant leads found. Analyzed ${leadStats.total_fetched} post${leadStats.total_fetched > 1 ? 's' : ''} across selected platforms. Try adjusting your keywords or criteria for better results.`
                : 'No posts found matching your keywords. Try using different or broader keywords.'
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
        {leadStats && (
          <Box sx={{ mt: 3, width: '100%', maxWidth: '400px' }}>
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
                  {leadStats.total_fetched}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                  Posts Analyzed
                </Typography>
              </Box>
              {leadStats.total_qualified > 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#17a2b8', mb: 0.5 }}>
                    {leadStats.total_qualified}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                    Qualified Posts
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
          </Box>
        )}
      </SmartModal>
    </Box>
  );
};

export default ConversationLeadFormV2;
