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
import { Box, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
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
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [savingStatus, setSavingStatus] = useState('');
  const [currentTip, setCurrentTip] = useState('');

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

  const { createOrganizationLeadForm, updateOrganizationSearchLeadForm, useGetExistingFormType } = useLeadFormHooks();

  const { data: existingForm, isSuccess } = useGetExistingFormType(userId || '', FormTypeEnum.ORGANIZATION);

  useEffect(() => {
    if (existingForm && isSuccess && userId) {
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
      });

      setExistingFormId(lead_form_id);
    }
  }, [existingForm, isSuccess, userId]);

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
              placeholder="Describe the kind of companies you’re looking for..."
            />
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

            <Box mt={6} sx={{ display: 'flex', alignItems: 'center' }}>
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
          <LoadingButton
            className="tour-generate-btn"
            onClick={handleSubmit}
            loading={createOrganizationLeadForm.isLoading || updateOrganizationSearchLeadForm.isLoading || isSaving}
            text={existingFormId ? 'Update Form' : 'Generate Leads'}
            loadingText={isSaving ? savingStatus : 'Saving...'}
          />

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
        subText={'Your form was successfully saved. Your form is now setup and ready to generate leads. ' + "We'll email you each time new leads (companies) come in."}
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
    </Box>
  );
};

export default OrganizationLeadForm;
