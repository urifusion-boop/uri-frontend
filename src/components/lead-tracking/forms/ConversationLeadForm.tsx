import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import CustomCheckbox from '@/components/input/CustomCheckbox';
import ListValuesInput from '@/components/input/ListValuesInput';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import SmartModal from '@/components/modals/SmartModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { ConversationalSearchFormDto } from '@/models/dtos/LeadFormDto';
import { BrowsercloudPlatformEnum } from '@/models/enum-models/BrowsercloudPlatformEnum';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, IconButton, Tooltip, Typography, Switch, FormControlLabel, Chip, Alert, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import PlatformSelector from '../PlatformSelector';
import { TwitterService } from '@/api/TwitterService';
import { FacebookService } from '@/api/FacebookService';
import { TiktokService } from '@/api/TiktokService';
import { LeadsService } from '@/api/LeadsService';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { LeadOpportunityTypeEnum } from '@/models/enum-models/LeadOpportunityTypeEnum';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';

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
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [isFetchingLeads, setIsFetchingLeads] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState<string>('');

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
      const {
        form_title,
        intent_type,
        buying_signals,
        excluded_keywords,
        ai_response_guide,
        keywords,
        competitors,
        lead_form_id,
        add_to_history,
        auto_generate,
        form_type,
      } = existingForm;

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
      });

      setExistingFormId(lead_form_id);
    }
  }, [existingForm, isSuccess, userId]);

  const handleChange = (field: keyof ConversationalSearchFormDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Sequential platform fetching
  const fetchLeadsFromPlatforms = async (leadFormId: string) => {
    if (!form.keywords || form.keywords.length === 0) {
      console.log('No keywords to fetch');
      return;
    }

    const keyword = form.keywords[0]; // Use first keyword
    const allLeads: LeadDto[] = [];

    setIsFetchingLeads(true);

    // Check which platforms are enabled
    const twitterEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.TWITTER && config.enabled
    );
    const facebookEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.FACEBOOK && config.enabled
    );
    const tiktokEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.TIKTOK && config.enabled
    );

    try {
      // Fetch Twitter leads sequentially
      if (twitterEnabled) {
        setFetchingStatus('Fetching leads from Twitter...');
        try {
          const twitterResponse = await TwitterService.fetchTweets(keyword, 2);
          const tweets = twitterResponse?.responseData?.tweets || [];

          tweets.forEach((tweet: any) => {
            allLeads.push({
              first_name: tweet.author || 'Twitter User',
              last_name: '',
              username: tweet.author || '',
              mention: tweet.text || '',
              lead_reason: tweet.text || '',
              lead_status: LeadStatusEnum.NEW,
              opportunity_type: LeadOpportunityTypeEnum.Other,
              tags: [],
              twitter_url: tweet.url || '',
              lead_link: tweet.url || '',
              social_profile_link: tweet.url || '',
              picture_url: '',
              created_date: new Date(tweet.created_at).toISOString(),
              last_updated: new Date(tweet.created_at).toISOString(),
              lead_type: FormTypeEnum.CONVERSATIONAL,
              website_url: tweet.url || '',
              lead_source: LeadSourceEnum.X,
              assigned_to: userId || '',
              starred: false,
              lead_form_snapshot_id: leadFormId,
            } as LeadDto);
          });

          console.log(`Fetched ${tweets.length} leads from Twitter`);
        } catch (error) {
          console.error('Error fetching Twitter leads:', error);
        }
      }

      // Fetch Facebook leads sequentially
      if (facebookEnabled) {
        setFetchingStatus('Fetching leads from Facebook...');
        try {
          const facebookResponse = await FacebookService.fetchPosts(keyword, 2);
          const posts = facebookResponse?.responseData?.posts || facebookResponse?.responseData?.data?.posts || [];

          posts.forEach((post: any) => {
            allLeads.push({
              first_name: post.author || 'Facebook User',
              last_name: '',
              username: post.author || '',
              mention: post.text || '',
              lead_reason: post.text || '',
              lead_status: LeadStatusEnum.NEW,
              opportunity_type: LeadOpportunityTypeEnum.Other,
              tags: [],
              lead_link: post.url || '',
              social_profile_link: post.url || '',
              facebook_url: post.url || '',
              picture_url: '',
              created_date: post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
              last_updated: post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
              lead_type: FormTypeEnum.CONVERSATIONAL,
              website_url: post.url || '',
              lead_source: LeadSourceEnum.FACEBOOK,
              assigned_to: userId || '',
              starred: false,
              lead_form_snapshot_id: leadFormId,
            } as LeadDto);
          });

          console.log(`Fetched ${posts.length} leads from Facebook`);
        } catch (error) {
          console.error('Error fetching Facebook leads:', error);
        }
      }

      // Fetch TikTok leads sequentially
      if (tiktokEnabled) {
        setFetchingStatus('Fetching leads from TikTok...');
        try {
          const tiktokResponse = await TiktokService.fetchPosts(keyword, 2);
          const posts = tiktokResponse?.responseData?.posts || tiktokResponse?.responseData?.data?.posts || [];

          posts.forEach((post: any) => {
            allLeads.push({
              first_name: post.author || post.username || 'TikTok User',
              last_name: '',
              username: post.author || post.username || '',
              mention: post.text || post.desc || '',
              lead_reason: post.text || post.desc || '',
              lead_status: LeadStatusEnum.NEW,
              opportunity_type: LeadOpportunityTypeEnum.Other,
              tags: [],
              lead_link: post.url || post.webVideoUrl || post.video_url || '',
              social_profile_link: post.url || post.webVideoUrl || post.video_url || '',
              picture_url: '',
              created_date: post.createTime ? new Date(post.createTime * 1000).toISOString() : new Date().toISOString(),
              last_updated: post.createTime ? new Date(post.createTime * 1000).toISOString() : new Date().toISOString(),
              lead_type: FormTypeEnum.CONVERSATIONAL,
              website_url: post.url || post.webVideoUrl || post.video_url || '',
              lead_source: LeadSourceEnum.TIKTOK,
              assigned_to: userId || '',
              starred: false,
              lead_form_snapshot_id: leadFormId,
            } as LeadDto);
          });

          console.log(`Fetched ${posts.length} leads from TikTok`);
        } catch (error) {
          console.error('Error fetching TikTok leads:', error);
        }
      }

      // Save all leads to database
      if (allLeads.length > 0) {
        setFetchingStatus(`Saving ${allLeads.length} leads to database...`);
        await LeadsService.multipleCreate(allLeads);
        console.log(`Successfully saved ${allLeads.length} leads`);
        setOpenSuccessModal(true);
      } else {
        triggerToast('error', 'No leads found across selected platforms');
      }

    } catch (error) {
      console.error('Error in sequential lead fetching:', error);
      triggerToast('error', 'Error fetching leads from platforms');
    } finally {
      setIsFetchingLeads(false);
      setFetchingStatus('');
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      triggerToast('error', 'You must be logged in to create or update a lead form');
      return;
    }

    const twitterEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.TWITTER && config.enabled
    );
    const linkedinEnabled = false;
    const facebookEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.FACEBOOK && config.enabled
    );
    const tiktokEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.TIKTOK && config.enabled
    );

    if ((twitterEnabled || linkedinEnabled || tiktokEnabled || facebookEnabled) && (!form.keywords || form.keywords.length === 0)) {
      triggerToast('error', 'Please add at least one keyword to monitor');
      return;
    }

    // Platform fetching is now handled by background jobs on the backend
    // Leads will be fetched immediately after form save/update

    const disabledPlatforms = new Set([
      BrowsercloudPlatformEnum.THREADS,
      BrowsercloudPlatformEnum.LINKEDIN,
    ]);
    const enabledPlatforms =
      form.platform_configs?.
        filter((c) => c.enabled && !disabledPlatforms.has(c.platform as any))
        .map((c) => c.platform) || [];

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
          const newFormId = response?.responseData?.data?.[0]?.lead_form_id;
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
      const data = autoPopulatedResponse.responseData;
      setForm((prev: any) => ({
        ...prev,
        form_title: data.form_title || prev.form_title,
        ai_response_guide: data.ai_response_guide || prev.ai_response_guide,
        keywords: data.keywords || prev.keywords,
        competitors: data.competitors || prev.competitors,
        buying_signals: data.buying_signals || prev.buying_signals,
        excluded_keywords: data.excluded_keywords || prev.excluded_keywords,
        add_to_history: data.add_to_history || prev.add_to_history,
        auto_generate: data.auto_generate || prev.auto_generate,
        form_type: data.form_type || prev.form_type,
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

  const disabledPlatforms = new Set([
    BrowsercloudPlatformEnum.THREADS,
  ]);

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
            <FormControlLabel
              control={<Switch checked color="primary" disabled />}
              label=""
            />
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
            <PlatformSelector
              platformConfigs={form.platform_configs || []}
              setPlatformConfigs={(configs) => handleChange('platform_configs', configs)}
            />
          </Box>
        )}

        {/* Keywords and Excluded Keywords */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <ListValuesInput
              label="Keywords"
              tooltip="The keywords you want to generate leads for. This includes the keywords you want to track conversations for."
              placeholder="e.g. 'Construction', 'Cement', 'Dangote', 'Real Estate', 'Renovation'"
              keywords={form.keywords || []}
              setKeywords={(val) => handleChange('keywords', val)}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <ListValuesInput
              label="Excluded Keywords"
              tooltip="This includes the keywords you want to exclude from the search."
              placeholder="e.g. 'Nestle', 'Unilever'"
              keywords={form.excluded_keywords || []}
              setKeywords={(val) => handleChange('excluded_keywords', val)}
            />
          </Box>
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

        {/* Submit Button */}
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <LoadingButton
              className="tour-generate-btn"
              onClick={handleSubmit}
              loading={createConversationalSearchLeadForm.isLoading || updateConversationalSearchLeadForm.isLoading || isFetchingLeads}
              text={existingFormId ? 'Save Update' : 'Save'}
              loadingText={isFetchingLeads ? fetchingStatus : "Saving..."}
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
        mainText="Success! 🎉"
        subText={
          form.enable_realtime
            ? 'Your form has been successfully saved. You should see your leads in a few minutes'
            : 'Your form was successfully saved.'
        }
        buttonText="View Leads"
        onClick={() => {
          setOpenSuccessModal(false);
          router.push('/leads-tracking/forms/leads?type=conversational');
        }}
        onOutlineButtonClick={() => setOpenSuccessModal(false)}
        outlineButtonText="Cancel"
      />
    </Box>
  );
};

export default ConversationLeadFormV2;
