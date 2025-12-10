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
import { IndividualLeadFormDto } from '@/models/dtos/LeadFormDto';
import { ContactEmailStatusEnum } from '@/models/enum-models/ContactEmailStatusEnum';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { LocationEnum } from '@/models/enum-models/LocationEnum';
import { PersonSenioritiesEnum } from '@/models/enum-models/PersonSenioritiesEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Box, Button, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';

//autopopulate should not send the form to the backend, it should just autopopulate the form with the data from the backend
const IndividualLeadForm = () => {
  const [form, setForm] = useState<IndividualLeadFormDto>({
    user_id: '',
    form_title: 'Individual Lead Form',
    contact_email_status: [],
    include_similar_titles: false,
    organization_locations: [],
    person_locations: [],
    person_seniorities: [],
    person_titles: [],
    q_keywords: '',
    q_organization_domains_list: [],
    add_to_history: false,
    auto_generate: false,
    per_page: 10,
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [savingStatus, setSavingStatus] = useState('');
  const [currentTip, setCurrentTip] = useState('');

  const { userDetails, subscriptionPlanType } = useAuth();
  const userId = userDetails?.userId;
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { createIndividualLeadForm, updateIndividualLeadForm, autoPopulateLeadForm, useGetExistingFormType, isAutoPopulating } = useLeadFormHooks();
  const [autoPopulateData, setAutoPopulateData] = useState<string>('');
  const [isEditingAIInput, setIsEditingAIInput] = useState(false);

  const { mutate: triggerAutoPopulate, data: autoPopulatedResponse, isSuccess: autoPopulateSuccess } = autoPopulateLeadForm;

  const { data: existingForm, isSuccess } = useGetExistingFormType(userId || '', FormTypeEnum.PERSON);

  useEffect(() => {
    console.log('existingForm', existingForm);
    if (existingForm && isSuccess && userId) {
      const {
        form_title,
        contact_email_status,
        include_similar_titles,
        organization_locations,
        person_locations,
        person_seniorities,
        person_titles,
        q_keywords,
        q_organization_domains_list,
        lead_form_id,
        add_to_history,
        auto_generate,
        per_page,
      } = existingForm;

      setForm({
        user_id: userId,
        form_title,
        contact_email_status,
        include_similar_titles,
        organization_locations,
        person_locations,
        person_seniorities,
        person_titles,
        q_keywords,
        q_organization_domains_list,
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

      setForm((prev) => ({
        ...prev,
        form_title: data.form_title || prev.form_title,
        contact_email_status: data.contact_email_status || [],
        include_similar_titles: data.include_similar_titles || false,
        organization_locations: data.organization_locations || [],
        person_locations: data.person_locations || [],
        person_seniorities: data.person_seniorities || [],
        person_titles: data.person_titles || [],
        q_keywords: data.q_keywords || '',
        q_organization_domains_list: data.q_organization_domains_list || [],
        add_to_history: data.add_to_history || prev.add_to_history,
        auto_generate: data.auto_generate || prev.auto_generate,
        per_page: data.per_page || prev.per_page,
      }));

      triggerToast('success', 'Fields updated using AI-generated suggestions');
    }
  }, [autoPopulateSuccess, autoPopulatedResponse]);

  const locationOptions: MultiSelectOption[] = Object.values(LocationEnum).map((v) => ({ value: v, label: v }));
  const seniorityOptions: MultiSelectOption[] = Object.values(PersonSenioritiesEnum).map((v) => ({ value: v, label: v }));
  const contactEmailStatusOptions: MultiSelectOption[] = Object.values(ContactEmailStatusEnum).map((v) => ({ value: v, label: v }));

  const handleChange = (field: keyof IndividualLeadFormDto, value: any) => {
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
      '💡 Tip: Specific job titles yield better results than generic ones',
      '🎯 Did you know? Email verification increases connection rates',
      '⚡ Pro tip: Multiple locations can expand your candidate pool',
      '🔍 Quality leads come from well-defined search criteria',
    ];

    // Status progression
    const statusMessages = [
      { msg: '📋 Validating form data...', progress: 20 },
      { msg: '🔍 Setting up search criteria...', progress: 40 },
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

    const payload: IndividualLeadFormDto = {
      ...form,
      user_id: userId,
    };

    if (existingFormId) {
      const updatePayload: IndividualLeadFormDto = {
        form_title: payload.form_title || '',
        organization_locations: payload.organization_locations || [],
        person_titles: payload.person_titles || [],
        include_similar_titles: payload.include_similar_titles || false,
        person_locations: payload.person_locations || [],
        person_seniorities: payload.person_seniorities || [],
        q_organization_domains_list: payload.q_organization_domains_list || [],
        contact_email_status: payload.contact_email_status || [],
        q_keywords: payload.q_keywords || '',
        add_to_history: payload.add_to_history || false,
        auto_generate: payload.auto_generate || false,
        per_page: payload.per_page || 10,
      };

      updateIndividualLeadForm.mutate(
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
      createIndividualLeadForm.mutate(payload, {
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

  const handleAutoPopulate = () => {
    triggerAutoPopulate({
      user_id: userId || '',
      lead_form_type: FormTypeEnum.PERSON,
      data: autoPopulateData,
    });
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
          Individual Lead Form
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280', mb: 4 }}>
          {existingFormId ? 'Edit your existing form' : 'What would you like to generate leads for?'}
          <EditOutlinedIcon sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle', color: '#9ca3af' }} />
        </Typography>

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
              Type what you’re trying to achieve and let AI auto-fill the form. Example: “Find startup founders in Berlin working in fintech.”
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
              placeholder="Describe the kind of individuals you’re looking for..."
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box>
              <ListValuesInput
                label="Job Titles"
                tooltip="List the specific job titles you're interested in, like 'Software Engineer', 'Marketing Manager', 'Product Designer' etc. Add multiple if needed. Leave blank if you don’t want to limit by job title."
                keywords={form.person_titles || []}
                setKeywords={(val) => handleChange('person_titles', val)}
                placeholder="e.g. Software Engineer"
              />
            </Box>

            <Box>
              <ListValuesInput
                label="Organization Domains"
                tooltip="Add the domains of companies you're interested in, like 'google.com', 'apple.com', 'microsoft.com' etc. Add multiple if needed. Leave blank if you don’t want to limit by domain. This helps grab people from specific companies whose emails carry the domain. for example people with emails like 'john@google.com', 'jane@apple.com', 'jim@microsoft.com' etc."
                keywords={form.q_organization_domains_list || []}
                setKeywords={(val) => handleChange('q_organization_domains_list', val)}
                placeholder="e.g. google.com"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box>
              {/* <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block' }}>
              Organization Domains
            </Typography>
            <ListValuesInput keywords={form.q_organization_domains_list || []} setKeywords={(val) => handleChange('q_organization_domains_list', val)} placeholder="e.g. google.com" /> */}

              <MultiSelectDropdown
                label="Person Locations"
                tooltip="Pick the cities or countries where the individuals you're targeting are living or working. Leave blank to search globally."
                options={locationOptions}
                selectedValues={form.person_locations?.map((v) => ({ value: v, label: v })) || []}
                onChange={(vals) =>
                  handleChange(
                    'person_locations',
                    vals.map((v) => v.value)
                  )
                }
                placeholder="e.g. London"
              />
            </Box>

            <MultiSelectDropdown
              label="Organization Locations"
              tooltip="Select the countries or regions where you want to find companies. This helps narrow down the search to specific areas. for example if you want to find companies in Lagos, Nigeria, select Nigeria. even if the companies are in multiple countries, you can narrow down to their specific locations. If you don’t care about location, leave it blank."
              options={locationOptions}
              selectedValues={form.organization_locations?.map((v) => ({ value: v, label: v })) || []}
              onChange={(vals) =>
                handleChange(
                  'organization_locations',
                  vals.map((v) => v.value)
                )
              }
              placeholder="e.g. Lagos"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <MultiSelectDropdown
              label="Contact Email Status"
              tooltip="Select the status of the contact email. This helps filter by email status. for example if you want to find people with valid emails, select Valid. if you want to find people with invalid emails, select Invalid. if you want to find people with no email, select No Email."
              options={contactEmailStatusOptions}
              selectedValues={form.contact_email_status?.map((v) => ({ value: v, label: v })) || []}
              onChange={(vals) =>
                handleChange(
                  'contact_email_status',
                  vals.map((v) => v.value)
                )
              }
              placeholder="e.g. Valid"
            />
            <MultiSelectDropdown
              label="Seniority Levels"
              tooltip="Select the seniority levels of the individuals you're targeting. This helps filter by seniority level. for example if you want to find people with Manager level, select Manager. if you want to find people with Director level, select Director. if you want to find people with no seniority level, select No Seniority. You can leave blank if you don’t want to limit by seniority level."
              options={seniorityOptions}
              selectedValues={form.person_seniorities?.map((v) => ({ value: v, label: v })) || []}
              onChange={(vals) =>
                handleChange(
                  'person_seniorities',
                  vals.map((v) => v.value)
                )
              }
              placeholder="e.g. Manager"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="Keyword or Industry"
              tooltip="Add keyword or industry to describe the kind of people you're looking for. E.g., ‘software engineer’, ‘marketing manager’, ‘product designer’, etc. Leave blank if you don’t want to limit by using a keyword or industry."
              placeholder="Keyword or Industry"
              value={form.q_keywords || ''}
              setValue={(val) => handleChange('q_keywords', val)}
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

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box mt={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                label="Include similar job titles"
                checked={form.include_similar_titles || false}
                onChange={(val) => handleChange('include_similar_titles', val)}
                tooltip="Check this if you want to include people with similar job titles to the ones you've specified. for example if you've specified 'Software Engineer', this will include people with titles like 'Software Developer', 'Senior Software Engineer', 'Software Analyst', etc."
              />
            </Box>
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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <LoadingButton
              className="tour-generate-btn"
              onClick={handleSubmit}
              loading={createIndividualLeadForm.isLoading || updateIndividualLeadForm.isLoading || isSaving}
              text={existingFormId ? 'Update Form' : 'Generate Leads'}
              loadingText={isSaving ? savingStatus : 'Saving...'}
            />

            <Button
              variant="outlined"
              onClick={() => router.push('/leads-tracking/forms/leads?type=individual')}
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
            {existingFormId ? 'Update your saved form details' : 'Click to start searching for candidates matching your criteria'}
          </Typography>
        </Box>
      </Box>

      {/* Success Modal */}
      <SmartModal
        open={openSuccessModal}
        image={<Image src="/assets/images/success.png" alt="Success" width={64} height={64} />}
        mainText="Success! 🎉"
        subText={'Your form was successfully saved. Your form is now setup and ready to generate leads. ' + "We'll email you each time new leads (individuals) come in."}
        buttonText="View Leads"
        onClick={() => {
          setOpenSuccessModal(false);
          router.push('/leads-tracking/forms/leads?type=individual');
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

export default IndividualLeadForm;
