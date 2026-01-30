import { OnboardingService } from '@/api/OnboardingService';
import CustomButton from '@/components/atoms/CustomButton';
import InputField from '@/components/atoms/Input';
import SelectField from '@/components/atoms/SelectField';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import useDebounce from '@/hooks/useDebounce';
import { useAuth } from '@/providers/AuthProvider';
import { ISelectData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, Grid, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { z } from 'zod';

// Industry options matching the PRD
const INDUSTRY_OPTIONS: ISelectData[] = [
  { label: 'Tech', value: 'tech' },
  { label: 'Retail', value: 'retail' },
  { label: 'Finance', value: 'finance' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Food & Beverage', value: 'food-beverage' },
  { label: 'Agency/Marketing', value: 'agency-marketing' },
  { label: 'Education', value: 'education' },
  { label: 'Other', value: 'other' },
];

// Customer type options
const CUSTOMER_TYPE_OPTIONS: ISelectData[] = [
  { label: 'B2B', value: 'b2b' },
  { label: 'B2C', value: 'b2c' },
  { label: 'Both', value: 'both' },
];

// Lead type options
const LEAD_TYPE_OPTIONS: ISelectData[] = [
  { label: 'Individual Leads', value: 'individual-leads' },
  { label: 'Business Leads', value: 'business-leads' },
  { label: 'Organizational Leads', value: 'organizational-leads' },
  { label: 'Sales Signals', value: 'conversational-leads' },
];

// Goal options
const GOAL_OPTIONS: ISelectData[] = [
  { label: 'Increase sales', value: 'increase-sales' },
  { label: 'Get more leads', value: 'get-more-leads' },
  { label: 'Grow brand visibility', value: 'grow-brand-visibility' },
  { label: 'Enter a new market', value: 'enter-new-market' },
  { label: 'Understand customer sentiment', value: 'understand-customer-sentiment' },
];

// Form validation schema
const BusinessDetailsSchema = z.object({
  yourName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  otherIndustry: z.string().optional(),
  businessLocation: z.string().min(2, 'Please enter your business location'),
  whatYouSell: z.string().min(10, 'Please provide a brief description (minimum 10 characters)'),
  customerType: z.string().min(1, 'Please select your customer type'),
  leadTypes: z.array(z.string()).min(1, 'Please select at least one lead type'),
  biggestGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  biggestChallenge: z.string().optional(),
  currentTools: z.string().optional(),
});

type BusinessDetailsValues = z.infer<typeof BusinessDetailsSchema>;

const BusinessDetailsPage = () => {
  const router = useRouter();
  const { workflow, module } = router.query;
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!userDetails?.userId) {
      router.push('/login');
    }
  }, [userDetails, router]);

  // Redirect if workflow is missing (module comes later)
  useEffect(() => {
    if (router.isReady && !workflow) {
      toast.error('Missing workflow information');
      router.push('/onboarding/select-workflow');
    }
  }, [router.isReady, workflow, router]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BusinessDetailsValues>({
    mode: 'onBlur',
    resolver: zodResolver(BusinessDetailsSchema),
    defaultValues: {
      yourName: userDetails?.firstName && userDetails?.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : '',
      email: userDetails?.email || '',
      phoneNumber: userDetails?.phoneNumber || '',
      leadTypes: [],
      biggestGoals: [],
    },
  });

  // Watch industry selection to show/hide "Other" input
  const selectedIndustry = watch('industry');
  useEffect(() => {
    setShowOtherIndustry(selectedIndustry === 'other');
  }, [selectedIndustry]);

  const [industrySelect, setIndustrySelect] = useState<ISelectData | null>(null);
  const [customerTypeSelect, setCustomerTypeSelect] = useState<ISelectData | null>(null);
  const [leadTypesSelect, setLeadTypesSelect] = useState<ISelectData[]>([]);
  const [goalsSelect, setGoalsSelect] = useState<ISelectData[]>([]);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Watch all form fields for auto-save
  const formValues = watch();
  const debouncedFormValues = useDebounce(formValues, 2000); // Auto-save after 2 seconds of inactivity

  // Calculate form completion progress
  const calculateProgress = useCallback(() => {
    const requiredFields = ['yourName', 'email', 'phoneNumber', 'businessName', 'industry', 'businessLocation', 'whatYouSell', 'customerType', 'leadTypes', 'biggestGoals'];
    const filledFields = requiredFields.filter((field) => {
      const value = formValues[field as keyof BusinessDetailsValues];
      if (Array.isArray(value)) return value.length > 0;
      return value && String(value).trim().length > 0;
    });
    return (filledFields.length / requiredFields.length) * 100;
  }, [formValues]);

  const progress = calculateProgress();

  // Auto-save functionality
  useEffect(() => {
    const autoSaveData = async () => {
      if (!userDetails?.userId || progress === 0) return;

      try {
        setAutoSaving(true);
        // Save to localStorage as backup
        localStorage.setItem(`businessDetails_${userDetails.userId}`, JSON.stringify(debouncedFormValues));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setAutoSaving(false);
      }
    };

    autoSaveData();
  }, [debouncedFormValues, userDetails?.userId, progress]);

  const onSubmit = async (data: BusinessDetailsValues) => {
    if (!userDetails?.userId) {
      toast.error('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);

      console.log('💾 Saving business details for user:', userDetails.userId);

      // Call API to save business details
      const response = await OnboardingService.saveBusinessDetails(userDetails.userId, data);

      console.log('✅ Business details saved:', response);

      if (response.status) {
        // Update step to 3 (business details saved)
        console.log('📝 Updating onboarding step to 3...');
        const stepResponse = await OnboardingService.updateOnboardingStep(userDetails.userId, { step: 3 });
        console.log('✅ Step updated:', stepResponse);

        toast.success('Business details saved successfully!');

        // Navigate to module selection page with workflow
        router.push({
          pathname: `/onboarding/select-module/${workflow}`,
        });
      } else {
        throw new Error(response.responseMessage || 'Failed to save business details');
      }
    } catch (error: any) {
      console.error('Error saving business details:', error);

      // Extract detailed error message from various possible error structures
      let errorMessage = 'Failed to save business details. Please try again.';

      if (error?.response?.data?.responseMessage) {
        errorMessage = error.response.data.responseMessage;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Handle validation errors
      if (error?.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.join(', ');
        } else if (typeof validationErrors === 'object') {
          errorMessage = Object.values(validationErrors).join(', ');
        }
      }

      // Handle specific HTTP status codes
      if (error?.response?.status === 400) {
        errorMessage = `Validation Error: ${errorMessage}`;
      } else if (error?.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => router.push('/login'), 2000);
      } else if (error?.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Service not found. Please contact support.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.status === 402) {
        errorMessage = 'Subscription required. Please upgrade your plan.';
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <SeoHead title="Tell Us About Your Business - Uri Creative" />

      <Box
        sx={{
          background: themeColors.background,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 2, md: 3 },
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: '750px',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: { xs: 3, md: 5 },
            boxShadow: '1px 1px 6px 3px #00000011',
            position: 'relative',
          }}
        >
          {/* Back Button */}
          <Box
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              color: themeColors.primary,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <FaArrowLeft size={16} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Back</Typography>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
            <Typography
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 700,
                color: '#1f2937',
                mb: 1,
              }}
            >
              Tell Me About Your Business
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, md: 15 },
                fontWeight: 400,
                color: '#6b7280',
                mb: 2,
              }}
            >
              Help us customize your experience (takes less than 60 seconds)
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: themeColors.primary }}>{Math.round(progress)}% Complete</Typography>
                {lastSaved && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FaCheckCircle size={12} color="#10B981" />
                    <Typography sx={{ fontSize: 11, color: '#10B981' }}>{autoSaving ? 'Saving...' : 'Saved'}</Typography>
                  </Box>
                )}
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: themeColors.primary,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Validation Errors Summary */}
          {Object.keys(errors).length > 0 && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626', mb: 1 }}>⚠️ Please fix the following errors before continuing:</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {Object.entries(errors).map(([field, error]) => (
                  <Typography key={field} component="li" sx={{ fontSize: 13, color: '#DC2626', mb: 0.5 }}>
                    {error?.message || `Invalid ${field}`}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Section 1: Personal Information */}
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#374151', mb: 1 }}>👤 Personal Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Your Name */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="yourName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Your Name*"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.yourName?.message}
                      placeholder="Enter your full name"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>

              {/* Email Address */}
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField label="Email Address*" type="email" value={value} onChange={onChange} onBlur={onBlur} errorText={errors?.email?.message} placeholder="you@company.com" radius={2.5} />
                  )}
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Phone Number*"
                      type="tel"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.phoneNumber?.message}
                      placeholder="+1 (555) 123-4567"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>

              {/* Section 2: Business Details */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#374151', mb: 1 }}>🏢 Business Details</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Business Name */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="businessName"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Business Name*"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.businessName?.message}
                      placeholder="Enter your business name"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>

              {/* Industry */}
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field: { onChange } }) => (
                    <SelectField
                      label="Industry*"
                      options={INDUSTRY_OPTIONS}
                      value={industrySelect}
                      onChange={(e) => {
                        if (Array.isArray(e)) return;
                        setIndustrySelect(e);
                        onChange(e?.value || '');
                      }}
                      placeholder="Select your industry"
                      errorText={errors?.industry?.message}
                      height="40px"
                    />
                  )}
                />
              </Grid>

              {/* Other Industry (conditional) */}
              {showOtherIndustry && (
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="otherIndustry"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <InputField
                        label="Specify Industry"
                        type="text"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        errorText={errors?.otherIndustry?.message}
                        placeholder="e.g., Healthcare, Manufacturing"
                        radius={2.5}
                      />
                    )}
                  />
                </Grid>
              )}

              {/* Business Location */}
              <Grid item xs={12} md={showOtherIndustry ? 12 : 6}>
                <Controller
                  control={control}
                  name="businessLocation"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Business Location (City + Country)*"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.businessLocation?.message}
                      placeholder="e.g., New York, USA"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>

              {/* What do you sell */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="whatYouSell"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="What do you sell?*"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.whatYouSell?.message}
                      placeholder="e.g., We sell handmade jewelry for weddings (minimum 10 characters)"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>

              {/* Customer Type */}
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="customerType"
                  render={({ field: { onChange } }) => (
                    <SelectField
                      label="Who are your customers?*"
                      options={CUSTOMER_TYPE_OPTIONS}
                      value={customerTypeSelect}
                      onChange={(e) => {
                        if (Array.isArray(e)) return;
                        setCustomerTypeSelect(e);
                        onChange(e?.value || '');
                      }}
                      placeholder="Select customer type"
                      errorText={errors?.customerType?.message}
                      height="40px"
                    />
                  )}
                />
              </Grid>

              {/* Lead Types */}
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="leadTypes"
                  render={({ field: { onChange } }) => (
                    <SelectField
                      label="What type of leads do you want?*"
                      options={LEAD_TYPE_OPTIONS}
                      value={leadTypesSelect}
                      onChange={(e) => {
                        const values = Array.isArray(e) ? e : e ? [e] : [];
                        setLeadTypesSelect(values);
                        onChange(values.map((v) => v.value));
                      }}
                      placeholder="Select lead types (multiple allowed)"
                      errorText={errors?.leadTypes?.message}
                      height="40px"
                      multiSelect={true}
                    />
                  )}
                />
              </Grid>

              {/* Section 3: Your Goals */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#374151', mb: 1 }}>🎯 Your Goals & Challenges</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Biggest Goals */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="biggestGoals"
                  render={({ field: { onChange } }) => (
                    <SelectField
                      label="What is your biggest goal right now?*"
                      options={GOAL_OPTIONS}
                      value={goalsSelect}
                      onChange={(e) => {
                        const values = Array.isArray(e) ? e : e ? [e] : [];
                        setGoalsSelect(values);
                        onChange(values.map((v) => v.value));
                      }}
                      placeholder="Select your goals (multiple allowed)"
                      errorText={errors?.biggestGoals?.message}
                      height="40px"
                      multiSelect={true}
                    />
                  )}
                />
              </Grid>

              {/* Biggest Challenge (Optional) */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="biggestChallenge"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="What is your biggest challenge currently? (Optional)"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.biggestChallenge?.message}
                      placeholder="Tell us about your main challenge"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>

              {/* Current Tools (Optional) */}
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="currentTools"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Do you currently use any marketing/sales tools? (Optional)"
                      type="text"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      errorText={errors?.currentTools?.message}
                      placeholder="e.g., HubSpot, Salesforce, Mailchimp"
                      radius={2.5}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4 }}>
              <CustomButton
                mode="primary"
                type="submit"
                loading={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                }}
              >
                Continue to Dashboard →
              </CustomButton>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  textAlign: 'center',
                  color: '#9CA3AF',
                  mt: 2,
                }}
              >
                This should take less than 60 seconds
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default BusinessDetailsPage;
