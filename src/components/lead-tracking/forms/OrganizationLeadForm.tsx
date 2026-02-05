import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import CustomCheckbox from '@/components/input/CustomCheckbox';
import ListValuesInput from '@/components/input/ListValuesInput';
import MultiSelectDropdown, { MultiSelectOption } from '@/components/input/MultiSelectDropdown';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import { LimitExceededModal } from '@/components/modals/LimitExceededModal';
import SmartModal from '@/components/modals/SmartModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { OrganizationLeadFormDto } from '@/models/dtos/LeadFormDto';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { LocationEnum } from '@/models/enum-models/LocationEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, FormControl, IconButton, LinearProgress, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { HiPencil } from 'react-icons/hi';

const OrganizationLeadForm = () => {
  const [form, setForm] = useState<OrganizationLeadFormDto>({
    form_title: 'Organization Lead Form',
    technology_uids: [],
    organization_locations: [],
    organization_not_locations: [],
    organization_num_employees_ranges: [],
    q_organization_keyword_tags: [],
    q_organization_name: '',
    revenue_range_max: 0,
    revenue_range_min: 0,
    per_page: 10,
    monitoring_interval_hours: 0,
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [savingStatus, setSavingStatus] = useState('');
  const [currentTip, setCurrentTip] = useState('');
  const [showLeadGoalModal, setShowLeadGoalModal] = useState(false);
  const leadGoalRef = useRef<HTMLDivElement>(null);

  const { autoPopulateLeadForm, isAutoPopulating } = useLeadFormHooks();
  const [autoPopulateData, setAutoPopulateData] = useState('');
  const [isEditingAIInput, setIsEditingAIInput] = useState(false);

  const { mutate: triggerAutoPopulate, data: autoPopulatedResponse, isSuccess: autoPopulateSuccess } = autoPopulateLeadForm;

  const { userDetails, subscriptionPlanType } = useAuth();
  const userId = userDetails?.userId;
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false);

  // Get feature limits from store
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { createOrganizationLeadForm, updateOrganizationSearchLeadForm, useGetExistingFormType, useGetLeadFormById, useGetFormsByUserAndType } = useLeadFormHooks();

  // Check if we're in create mode (creating a new form) or edit mode (editing existing)
  const isCreateMode = router.query.mode === 'create';
  const formIdFromUrl = router.query.form_id as string;

  // Fetch form by ID if form_id is provided, otherwise fetch by type (gets first/default)
  const { data: formById, isSuccess: isSuccessById } = useGetLeadFormById(formIdFromUrl);
  const { data: formByType, isSuccess: isSuccessByType } = useGetExistingFormType(userId || '', FormTypeEnum.ORGANIZATION);

  // Fetch all forms of this type for the selector dropdown
  const { data: allFormsOfType = [] } = useGetFormsByUserAndType(userId || '', FormTypeEnum.ORGANIZATION);

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
    // Only load existing form data if NOT in create mode
    if (existingForm && isSuccess && userId && !isCreateMode) {
      const {
        form_title,
        organization_locations,
        organization_not_locations,
        organization_num_employees_ranges,
        q_organization_keyword_tags,
        q_organization_name,
        revenue_range_min,
        revenue_range_max,
        lead_form_id,
        add_to_history,
        auto_generate,
        per_page,
        lead_generation_goal,
        monitoring_interval_hours,
      } = existingForm;

      setForm({
        user_id: userId,
        form_title,
        organization_locations,
        organization_not_locations,
        organization_num_employees_ranges,
        q_organization_keyword_tags,
        q_organization_name,
        revenue_range_min,
        revenue_range_max,
        add_to_history,
        auto_generate,
        per_page,
        lead_generation_goal,
        monitoring_interval_hours: monitoring_interval_hours || 0,
      });

      setExistingFormId(lead_form_id);
    } else if (isCreateMode) {
      // In create mode, reset form to blank state and ensure existingFormId is null
      setForm({
        user_id: userId || '',
        form_title: 'Organization Lead Form',
        technology_uids: [],
        organization_locations: [],
        organization_not_locations: [],
        organization_num_employees_ranges: [],
        q_organization_keyword_tags: [],
        q_organization_name: '',
        revenue_range_max: 0,
        revenue_range_min: 0,
        add_to_history: false,
        auto_generate: false,
        per_page: 10,
        lead_generation_goal: '',
        monitoring_interval_hours: 0,
      });
      setExistingFormId(null);
    }
  }, [existingForm, isSuccess, userId, isCreateMode, formIdFromUrl]);

  useEffect(() => {
    if (autoPopulateSuccess && autoPopulatedResponse?.responseData) {
      const data = autoPopulatedResponse.responseData;
      setForm((prev: any) => ({
        ...prev,
        form_title: data.form_title || prev.form_title,
        organization_locations: data.organization_locations || [],
        organization_not_locations: data.organization_not_locations || [],
        organization_num_employees_ranges: data.organization_num_employees_ranges || [],
        q_organization_keyword_tags: data.q_organization_keyword_tags || [],
        q_organization_name: data.q_organization_name || '',
        revenue_range_min: data.revenue_range_min || 0,
        revenue_range_max: data.revenue_range_max || 0,
        technology_uids: data.technology_uids || [],
        add_to_history: data.add_to_history || prev.add_to_history,
        auto_generate: data.auto_generate || prev.auto_generate,
        per_page: data.per_page || prev.per_page,
      }));
      triggerToast('success', 'Fields updated using AI-generated suggestions');
    }
  }, [autoPopulateSuccess, autoPopulatedResponse, setForm]);

  const handleAutoPopulate = () => {
    if (!userId) return;
    triggerAutoPopulate({
      user_id: userId,
      lead_form_type: FormTypeEnum.ORGANIZATION,
      data: autoPopulateData,
    });
  };

  const locationOptions: MultiSelectOption[] = Object.values(LocationEnum).map((location) => ({
    value: location,
    label: location,
  }));

  const handleChange = (field: keyof OrganizationLeadFormDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!userId) {
      triggerToast('error', 'You must be logged in to create or update a lead form');
      return;
    }

    // Check if lead_generation_goal is empty
    if (!form.lead_generation_goal || form.lead_generation_goal.trim() === '') {
      setShowLeadGoalModal(true);
      return;
    }

    proceedWithSave();
  };

  const proceedWithSave = () => {
    const leadLimit = featureLimit?.lead?.noOfLeads?.limit ?? 0;
    const leadCount = featureLimit?.lead?.noOfLeads?.count ?? 0;
    const isUnlimited = leadLimit === -1;
    const disableLimitCheck = (process.env.NEXT_PUBLIC_DISABLE_LIMIT_CHECK ?? 'true') === 'true';

    if (!disableLimitCheck) {
      if (!existingFormId && !isUnlimited && leadCount >= leadLimit) {
        setShowLimitExceededModal(true);
        return;
      }
    }

    // Start progress indicator
    setIsSaving(true);
    setSavingProgress(0);

    // Tips to show during saving
    const tips = [
      '💡 Tip: Target specific industries for more qualified organization leads',
      '🎯 Did you know? Revenue filters help find companies within your budget',
      '⚡ Pro tip: Employee range filters narrow down company size effectively',
      '🔍 Quality organization leads come from precise location targeting',
    ];

    // Status progression
    const statusMessages = [
      { msg: '📋 Validating organization criteria...', progress: 20 },
      { msg: '🏢 Setting up company filters...', progress: 40 },
      { msg: '💾 Saving form to database...', progress: 60 },
      { msg: '✨ Configuring search parameters...', progress: 80 },
      { msg: '🎯 Finalizing setup...', progress: 95 },
    ];

    let tipIndex = 0;
    let statusIndex = 0;

    // Rotate tips every 3 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(tips[tipIndex]);
      tipIndex = (tipIndex + 1) % tips.length;
    }, 3000);

    // Progress through statuses
    const statusInterval = setInterval(() => {
      if (statusIndex < statusMessages.length) {
        setSavingStatus(statusMessages[statusIndex].msg);
        setSavingProgress(statusMessages[statusIndex].progress);
        statusIndex++;
      }
    }, 800);

    // Set initial state
    setCurrentTip(tips[0]);
    setSavingStatus(statusMessages[0].msg);

    const payload: OrganizationLeadFormDto = {
      ...form,
      user_id: userId,
    };

    if (existingFormId) {
      const updatePayload: OrganizationLeadFormDto = {
        form_title: payload.form_title || '',
        organization_locations: payload.organization_locations || [],
        organization_num_employees_ranges: payload.organization_num_employees_ranges || [],
        q_organization_keyword_tags: payload.q_organization_keyword_tags || [],
        q_organization_name: payload.q_organization_name || '',
        organization_not_locations: payload.organization_not_locations || [],
        revenue_range_min: payload.revenue_range_min || 0,
        revenue_range_max: payload.revenue_range_max || 0,
        technology_uids: payload.technology_uids || [],
        add_to_history: payload.add_to_history || false,
        auto_generate: payload.auto_generate || false,
        per_page: payload.per_page || 10,
        lead_generation_goal: payload.lead_generation_goal || '',
      };

      updateOrganizationSearchLeadForm.mutate(
        { lead_form_id: existingFormId, data: updatePayload },
        {
          onSuccess: () => {
            clearInterval(tipInterval);
            clearInterval(statusInterval);
            setSavingProgress(100);
            setSavingStatus('✅ Successfully saved!');
            setTimeout(() => {
              setIsSaving(false);
              setOpenSuccessModal(true);
            }, 500);
          },
          onError: (error: any) => {
            clearInterval(tipInterval);
            clearInterval(statusInterval);
            setIsSaving(false);
            if (error?.response?.status === 403 || error?.response?.data?.limit_exceeded) {
              setShowLimitExceededModal(true);
            } else {
              triggerToast('error', error?.response?.data?.message || 'Update failed. Please try again.');
            }
          },
        }
      );
    } else {
      createOrganizationLeadForm.mutate(payload, {
        onSuccess: () => {
          clearInterval(tipInterval);
          clearInterval(statusInterval);
          setSavingProgress(100);
          setSavingStatus('✅ Successfully saved!');
          setTimeout(() => {
            setIsSaving(false);
            setOpenSuccessModal(true);
          }, 500);
        },
        onError: (error: any) => {
          clearInterval(tipInterval);
          clearInterval(statusInterval);
          setIsSaving(false);
          if (error?.response?.status === 403 || error?.response?.data?.limit_exceeded) {
            setShowLimitExceededModal(true);
          } else {
            triggerToast('error', error?.response?.data?.message || 'Creation failed. Please try again.');
          }
        },
      });
    }
  };

  return (
    <Box sx={{ maxWidth: '950px', mx: 'auto', mt: 4 }}>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          p: { xs: 3, md: 5 },
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 600, mb: 1, color: '#1f2937' }}>
          Organization Lead Form
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280', mb: 4 }}>
          {existingFormId ? 'Edit your existing form' : 'What kind of companies are you looking for?'}
          <EditOutlinedIcon
            sx={{
              fontSize: 16,
              ml: 1,
              verticalAlign: 'middle',
              color: '#9ca3af',
            }}
          />
        </Typography>

        <Box className="tour-form-fields">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(1, 1fr)' },
              gap: 3,
              mb: 3,
            }}
          >
            <SingleFieldInput
              label="Form Title"
              tooltip="Give your form a name to help you identify it later. This will be displayed in the lead generation dashboard."
              placeholder="Form Title"
              value={form.form_title || ''}
              setValue={(value) => handleChange('form_title', value)}
              required
            />
          </Box>

          {/* AI Form Completion Section */}
          <Box my={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#4b5563' }}>
                Want help completing this form?
              </Typography>
              <HiPencil size={18} />
            </Box>

            <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block' }}>
              Type what you’re trying to achieve and let AI auto-fill the form. Example: “Find companies in San Francisco working in fintech.”
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
              placeholder="Describe the kind of companies you're looking for..."
            />
          </Box>

          {/* Frequency Control Section */}
          <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              How often should we search for new leads?
              <Tooltip title="Choose how frequently Apollo should check for new organizations matching your criteria. Select 'One-time only' for a single search, or set a recurring interval for continuous monitoring.">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }} />
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
                      borderColor: '#CD1B78',
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

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 3,
              mb: 3,
            }}
          >
            <SingleFieldInput
              label="Minimum Revenue (Optional)"
              tooltip="Specify the minimum yearly revenue the target company should be making. Leave blank if you don’t want to limit by revenue."
              placeholder="e.g. 100000"
              value={form.revenue_range_min?.toString() || ''}
              setValue={(value) => handleChange('revenue_range_min', parseInt(value) || 0)}
              required={false}
            />

            <SingleFieldInput
              label="Maximum Revenue (Optional)"
              tooltip="Specify the maximum yearly revenue the company should not exceed. Leave blank if you don’t want to set a limit."
              placeholder="Maximum Revenue"
              value={form.revenue_range_max?.toString() || ''}
              setValue={(value) => handleChange('revenue_range_max', parseInt(value) || 0)}
              required={false}
            />

            <SingleFieldInput
              label="Leads Per Generation"
              tooltip="Set the number of leads to generate per generation. This helps control the number of leads generated per generation. for example if you want to generate 10 leads per generation, set it to 10. if you want to generate 20 leads per generation, set it to 20. if you want to generate 30 leads per generation, set it to 30. if you want to generate 40 leads per generation, set it to 40. if you want to generate 50 leads per generation, set it to 50."
              placeholder="e.g. 10"
              value={form.per_page?.toString() || ''}
              setValue={(val) => handleChange('per_page', val)}
              required={false}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 3,
            }}
          >
            <ListValuesInput
              label="Technologies Used"
              tooltip="Add the names of specific technologies the ideal company should be using. For example: Salesforce, HubSpot, SAP."
              keywords={form.technology_uids || []}
              setKeywords={(values) => handleChange('technology_uids', values)}
              placeholder="e.g. salesforce"
            />
            <ListValuesInput
              label="Keywords"
              tooltip="Add keywords to describe the kind of company you're looking for. E.g., ‘fintech’, ‘blockchain’, ‘B2B’, etc."
              keywords={form.q_organization_keyword_tags || []}
              setKeywords={(values) => handleChange('q_organization_keyword_tags', values)}
              placeholder="e.g. fintech, blockchain"
            />
            <ListValuesInput
              label="Number of Employees"
              tooltip="Indicate how big the company should be in terms of staff. E.g., 1-10, 50-200. This helps filter by size."
              keywords={form.organization_num_employees_ranges || []}
              setKeywords={(values) => handleChange('organization_num_employees_ranges', values)}
              placeholder="e.g. 50,200"
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 3,
            }}
          >
            <MultiSelectDropdown
              label="Organization Locations"
              tooltip="Select the countries or regions where you want to find companies. This helps narrow down the search to specific areas. If you don’t care about location, leave it blank."
              options={locationOptions}
              selectedValues={
                form.organization_locations?.map((v) => ({
                  value: v,
                  label: v,
                })) || []
              }
              onChange={(values) =>
                handleChange(
                  'organization_locations',
                  values.map((v) => v.value)
                )
              }
              placeholder="e.g. San Francisco"
            />

            <MultiSelectDropdown
              label="Exclude Locations"
              tooltip="If you want to avoid companies from specific regions or cities, list them here. This helps exclude specific areas from your results."
              options={locationOptions}
              selectedValues={
                form.organization_not_locations?.map((v) => ({
                  value: v,
                  label: v,
                })) || []
              }
              onChange={(values) =>
                handleChange(
                  'organization_not_locations',
                  values.map((v) => v.value)
                )
              }
              placeholder="e.g. Ireland"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr ' }, gap: 3, mb: 3 }}>
            <Box mt={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                label="Add to history"
                checked={form.add_to_history || false}
                onChange={(val) => handleChange('add_to_history', val)}
                tooltip="Check this if you want to add the form to your history. This will add the form to your history so you can easily find it later."
              />
            </Box>
          </Box>

          {/* Lead Generation Goal - Positioned before progress indicator */}
          <Box ref={leadGoalRef} sx={{ mt: 4, mb: 3 }}>
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
              placeholder="e.g., I want to sell enterprise software to Fortune 500 companies"
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
        </Box>

        {/* Progress Indicator */}
        {isSaving && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                {savingStatus}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                {savingProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={savingProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#CD1B78',
                  borderRadius: 4,
                },
              }}
            />
            {currentTip && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: '#eff6ff',
                  borderRadius: 1.5,
                  border: '1px solid #bfdbfe',
                }}
              >
                <Typography variant="body2" sx={{ color: '#1e40af', fontSize: '0.875rem' }}>
                  {currentTip}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <LoadingButton
              className="tour-generate-btn"
              onClick={handleSubmit}
              loading={createOrganizationLeadForm.isLoading || updateOrganizationSearchLeadForm.isLoading || isSaving}
              text={existingFormId ? 'Update Form' : 'Generate Leads'}
              loadingText={isSaving ? savingStatus : 'Saving...'}
            />

            <Button
              variant="outlined"
              onClick={() => router.push('/leads-tracking/forms/leads?type=organization')}
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
            {existingFormId ? 'Update your saved form details' : 'Click to start searching for companies that match your filters'}
          </Typography>
        </Box>
      </Box>

      {/* Success Modal */}
      <SmartModal
        open={openSuccessModal}
        image={<Image src="/assets/images/success.png" alt="Success" width={64} height={64} />}
        mainText="Success! 🎉"
        subText={
          'Your organization lead form has been successfully saved. Please wait approximately 5 minutes for your first set of leads to be generated and check your email for updates. Going forward, you will automatically receive email notifications each time new organizations matching your criteria are discovered.'
        }
        buttonText="View Leads"
        onClick={() => {
          setOpenSuccessModal(false);
          router.push('/leads-tracking/forms/leads?type=organization');
        }}
        onOutlineButtonClick={() => setOpenSuccessModal(false)}
        outlineButtonText="Cancel"
      />

      {/* Limit Exceeded Modal */}
      <LimitExceededModal
        isOpen={showLimitExceededModal}
        onClose={() => setShowLimitExceededModal(false)}
        featureType="lead"
        currentUsage={featureLimit?.lead?.noOfLeads?.count ?? 0}
        limit={featureLimit?.lead?.noOfLeads?.limit ?? 0}
        planName={subscriptionPlanType ?? 'your current plan'}
      />

      {/* Lead Goal Reminder Modal */}
      <SmartModal
        open={showLeadGoalModal}
        onClose={() => {
          setShowLeadGoalModal(false);
          proceedWithSave();
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
        handleCancel={() => {
          setShowLeadGoalModal(false);
          proceedWithSave();
        }}
        cancelText="Continue Without Goal"
      />
    </Box>
  );
};

export default OrganizationLeadForm;
