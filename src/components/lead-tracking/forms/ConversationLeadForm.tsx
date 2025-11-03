import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import CustomCheckbox from '@/components/input/CustomCheckbox';
import ListValuesInput from '@/components/input/ListValuesInput';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import SmartModal from '@/components/modals/SmartModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { ConversationalSearchFormDto, PlatformConfigFormDto } from '@/models/dtos/LeadFormDto';
import { TwitterService } from '@/api/TwitterService';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { BrowsercloudPlatformEnum } from '@/models/enum-models/BrowsercloudPlatformEnum';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, IconButton, Tooltip, Typography, Switch, FormControlLabel, Chip, Alert, Button } from '@mui/material';
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
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [twitterResults, setTwitterResults] = useState<TwitterFetchResponseDto | null>(null);
  const [isLoadingTwitter, setIsLoadingTwitter] = useState(false);

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
        enable_realtime: (existingForm as any).enable_realtime ?? true,
        monitoring_platforms: (existingForm as any).monitoring_platforms || [],
        platform_configs: (existingForm as any).platform_configs || [],
      });

      setExistingFormId(lead_form_id);
    }
  }, [existingForm, isSuccess, userId]);

  const handleChange = (field: keyof ConversationalSearchFormDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      triggerToast('error', 'You must be logged in to create or update a lead form');
      return;
    }

    // Check if Twitter is enabled and keywords exist
    const twitterEnabled = form.platform_configs?.some(
      (config) => config.platform === BrowsercloudPlatformEnum.TWITTER && config.enabled
    );
    
    if (twitterEnabled && (!form.keywords || form.keywords.length === 0)) {
      triggerToast('error', 'Please add at least one keyword to fetch Twitter data');
      return;
    }

    // If Twitter is enabled, fetch Twitter data first
    if (twitterEnabled && form.keywords && form.keywords.length > 0) {
      setIsLoadingTwitter(true);
      try {
        const keyword = form.keywords[0]; // Use the first keyword
        const twitterResponse = await TwitterService.fetchTweets(keyword, 10);
        setTwitterResults(twitterResponse);
        
        // Store Twitter results in localStorage to pass to the table
        localStorage.setItem('twitterResults', JSON.stringify(twitterResponse));
        
        triggerToast('success', `Successfully fetched ${twitterResponse.responseData.total_tweets} tweets for "${keyword}"`);
        
        // Navigate directly to leads page with Twitter results
        router.push('/leads-tracking/forms/leads?type=conversational&active_tab=leads&page=1&source=twitter');
        return;
        
      } catch (error) {
        console.error('Twitter API error:', error);
        triggerToast('error', 'Failed to fetch Twitter data. Please try again.');
        return;
      } finally {
        setIsLoadingTwitter(false);
      }
    }

    // Original form submission logic for non-Twitter cases
    // Validate V2 fields
    if (form.enable_realtime && (!form.platform_configs || form.platform_configs.length === 0)) {
      triggerToast('error', 'Please select at least one platform for real-time monitoring');
      return;
    }

    // Extract enabled platforms
    const disabledPlatforms = new Set([
      BrowsercloudPlatformEnum.LINKEDIN,
      BrowsercloudPlatformEnum.THREADS,
      BrowsercloudPlatformEnum.FACEBOOK,
    ]);
    const enabledPlatforms =
      form.platform_configs?.
        filter((c) => c.enabled && !disabledPlatforms.has(c.platform as any))
        .map((c) => c.platform) || [];

    const payload: ConversationalSearchFormDto = {
      ...form,
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
        enable_realtime: payload.enable_realtime || false,
        monitoring_platforms: payload.monitoring_platforms || [],
        platform_configs: payload.platform_configs || [],
      };

      updateConversationalSearchLeadForm.mutate(
        { lead_form_id: existingFormId, data: updatePayload },
        {
          onSuccess: () => {
            setOpenSuccessModal(true);
          },
          onError: () => {
            triggerToast('error', 'Update failed. Please try again.');
          },
        }
      );
    } else {
      createConversationalSearchLeadForm.mutate(payload, {
        onSuccess: () => {
          setOpenSuccessModal(true);
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
    BrowsercloudPlatformEnum.LINKEDIN,
    BrowsercloudPlatformEnum.THREADS,
    BrowsercloudPlatformEnum.FACEBOOK,
  ]);
  const enabledPlatformsCount =
    form.platform_configs?.filter((c) => c.enabled && !disabledPlatforms.has(c.platform as any)).length || 0;

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
                Get instant notifications when leads appear across social platforms. No more 10-12 hour delays!
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={form.enable_realtime || false}
                  onChange={(e) => handleChange('enable_realtime', e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
          </Box>
        </Alert>

        {/* Form Title */}
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
            {enabledPlatformsCount > 0 && (
              <Typography variant="caption" sx={{ color: '#10b981', mt: 1, display: 'block', fontWeight: 500 }}>
                {enabledPlatformsCount} platform{enabledPlatformsCount > 1 ? 's' : ''} selected for real-time monitoring
              </Typography>
            )}
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

        {/* Submit Button */}
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e5e7eb' }}>
          <LoadingButton
            onClick={handleSubmit}
            loading={createConversationalSearchLeadForm.isLoading || updateConversationalSearchLeadForm.isLoading || isLoadingTwitter}
            text={
              isLoadingTwitter 
                ? 'Fetching Twitter Data...' 
                : existingFormId 
                ? 'Update Form' 
                : 'Start Real-time Monitoring'
            }
            loadingText={isLoadingTwitter ? 'Fetching tweets...' : 'Saving...'}
          />

          <Button
            variant="outlined"
            sx={{ ml: 2, borderRadius: 3, textTransform: 'none' }}
            onClick={() => router.push('/leads-tracking/forms/leads?type=conversational&source=twitter')}
          >
            Open Twitter Leads View
          </Button>

          <Typography variant="caption" sx={{ color: '#6b7280', mt: 2, display: 'block' }}>
            {existingFormId
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
            ? 'Your real-time monitoring is now active. You will receive instant notifications when new leads are detected.'
            : 'Your form was successfully saved. Your form is now setup and ready to generate leads.'
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
