import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import ListValuesInput from '@/components/input/ListValuesInput';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import { LimitExceededModal } from '@/components/modals/LimitExceededModal';
import SmartModal from '@/components/modals/SmartModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { BusinessSearchFormDto } from '@/models/dtos/LeadFormDto';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';

const BusinessLeadForm = () => {
  const [form, setForm] = useState<BusinessSearchFormDto>({
    user_id: '',
    form_title: 'Business Lead Form',
    business_name: '',
    business_summary: '',
    business_website: '',
    ai_response_guide: '',
    keywords: [],
    competitors: [],
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [existingFormId, setExistingFormId] = useState<string | null>(null);

  const { autoPopulateLeadForm, isAutoPopulating } = useLeadFormHooks();
  const [autoPopulateData, setAutoPopulateData] = useState('');
  const [isEditingAIInput, setIsEditingAIInput] = useState(false);

  const { mutate: triggerAutoPopulate, data: autoPopulatedResponse, isSuccess: autoPopulateSuccess } = autoPopulateLeadForm;
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false);

  const { userDetails, subscriptionPlanType } = useAuth();
  const userId = userDetails?.userId;
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { createBusinessSearchLeadForm, updateBusinessSearchLeadForm, useGetExistingFormType } = useLeadFormHooks();

  const { data: existingForm, isSuccess } = useGetExistingFormType(userId || '', FormTypeEnum.BUSINESS);

  useEffect(() => {
    console.log('existingForm', existingForm);
    if (existingForm && isSuccess && userId) {
      const { form_title, business_name, business_summary, business_website, ai_response_guide, keywords, competitors, lead_form_id } = existingForm;

      setForm({
        user_id: userId,
        form_title,
        business_name,
        business_summary,
        business_website,
        ai_response_guide,
        keywords,
        competitors,
      });

      if (keywords) {
        setKeywords(keywords);
      }

      setExistingFormId(lead_form_id);
    }
  }, [existingForm, isSuccess, userId]);

  const handleChange = (field: keyof BusinessSearchFormDto, value: any) => {
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

    const payload: BusinessSearchFormDto = {
      ...form,
      user_id: userId,
      keywords: keywords,
    };

    if (existingFormId) {
      const updatePayload: BusinessSearchFormDto = {
        user_id: userId,
        form_title: payload.form_title || '',
        business_name: payload.business_name || '',
        business_summary: payload.business_summary || '',
        business_website: payload.business_website || '',
        ai_response_guide: payload.ai_response_guide || '',
        keywords: payload.keywords || [],
        competitors: payload.competitors || [],
      };

      updateBusinessSearchLeadForm.mutate(
        { lead_form_id: existingFormId, data: updatePayload },
        {
          onSuccess: () => {
            setOpenSuccessModal(true);
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
      createBusinessSearchLeadForm.mutate(payload, {
        onSuccess: () => {
          setOpenSuccessModal(true);
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

  useEffect(() => {
    if (autoPopulateSuccess && autoPopulatedResponse?.responseData) {
      const data = autoPopulatedResponse.responseData;
      setForm((prev: any) => ({
        ...prev,
        form_title: data.form_title || prev.form_title,
        business_name: data.business_name || prev.business_name,
        business_summary: data.business_summary || prev.business_summary,
        business_website: data.business_website || prev.business_website,
        ai_response_guide: data.ai_response_guide || prev.ai_response_guide,
        keywords: data.keywords || prev.keywords,
        competitors: data.competitors || prev.competitors,
      }));
      triggerToast('success', 'Fields updated using AI-generated suggestions');
    }
  }, [autoPopulateSuccess, autoPopulatedResponse, setForm]);

  const handleAutoPopulate = () => {
    if (!userId) return;
    triggerAutoPopulate({
      user_id: userId,
      lead_form_type: FormTypeEnum.BUSINESS,
      data: autoPopulateData,
    });
  };

  return (
    <Box sx={{ maxWidth: '950px', mx: 'auto', mt: 4 }}>
      <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', p: { xs: 3, md: 5 }, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 600, mb: 1, color: '#1f2937' }}>
          Business Lead Form
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280', mb: 4 }}>
          {existingFormId ? 'Edit your existing form' : 'What would you like to generate leads for?'}
          <EditOutlinedIcon sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle', color: '#9ca3af' }} />
        </Typography>

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
            placeholder="Describe the kind of people you’re looking for..."
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="Business Name"
              tooltip="The name of the business you want to generate leads for."
              placeholder="e.g. Google"
              value={form.business_name || ''}
              setValue={(val) => handleChange('business_name', val)}
              required
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="Business Summary"
              tooltip="A short summary of the business you want to generate leads for."
              placeholder="e.g. 'Google is a company that makes search engines.'"
              value={form.business_summary || ''}
              setValue={(val) => handleChange('business_summary', val)}
              required={false}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="Business Website Link"
              tooltip="The website of the business you want to generate leads for."
              placeholder="e.g. https://www.google.com"
              value={form.business_website || ''}
              setValue={(val) => handleChange('business_website', val)}
              required={false}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="AI Response Guide"
              tooltip="How should Dera AI compose your leads follow up messages?"
              placeholder="e.g. 'Respond like a human, not like a robot'"
              value={form.ai_response_guide || ''}
              setValue={(val) => handleChange('ai_response_guide', val)}
              required={false}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <Box>
            <ListValuesInput
              label="Keywords"
              tooltip="Keywords are the terms that will be used to search for leads. This will be displayed in the lead generation dashboard."
              keywords={form.keywords || []}
              setKeywords={(val) => handleChange('keywords', val)}
              placeholder="e.g. Software Engineer"
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e5e7eb' }}>
          <LoadingButton
            onClick={handleSubmit}
            loading={createBusinessSearchLeadForm.isLoading || updateBusinessSearchLeadForm.isLoading}
            text={existingFormId ? 'Update Form' : 'Generate Leads'}
            loadingText="Saving..."
          />

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
        subText="Your form was successfully saved. Your form is now setup and ready to generate leads."
        buttonText="View Leads"
        onClick={() => {
          setOpenSuccessModal(false);
          router.push('/leads-tracking/forms/leads?type=business');
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

export default BusinessLeadForm;
