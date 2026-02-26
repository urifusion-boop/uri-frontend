import { TrialService } from '@/api/TrialService';
import { triggerToast } from '@/components/atoms/CustomToast';
import LoadingButton from '@/components/buttons/LoadingButton';
import AnimatedSendInput from '@/components/input/AnimatedSendInput';
import CustomCheckbox from '@/components/input/CustomCheckbox';
import ListValuesInput from '@/components/input/ListValuesInput';
import SingleFieldInput from '@/components/input/SingleFieldInput';
import { LimitExceededModal } from '@/components/modals/LimitExceededModal';
import SmartModal from '@/components/modals/SmartModal';
import TrialActivationModal from '@/components/trial/TrialActivationModal';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { GoogleMapsLeadFormDto } from '@/models/dtos/LeadFormDto';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Box, Button, FormControl, IconButton, LinearProgress, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { HiPencil } from 'react-icons/hi';

const GoogleMapsLeadForm = () => {
  const [form, setForm] = useState<GoogleMapsLeadFormDto>({
    user_id: '',
    form_title: 'Google Maps Lead Form',
    maps_search_mode: 'auto',
    maps_search_query: '',
    maps_location: '',
    maps_latitude: undefined,
    maps_longitude: undefined,
    maps_radius_km: 5.0,
    maps_business_types: [],
    maps_min_rating: undefined,
    maps_exclude_closed: true,
    maps_max_results: 20,
    add_to_history: false,
    monitoring_interval_hours: 0,
  });

  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false);
  const [showTrialActivationModal, setShowTrialActivationModal] = useState(false);
  const [showLeadGoalModal, setShowLeadGoalModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [savingStatus, setSavingStatus] = useState('');
  const [currentTip, setCurrentTip] = useState('');
  const leadGoalRef = useRef<HTMLDivElement>(null);

  const { userDetails, subscriptionPlanType } = useAuth();
  const userId = userDetails?.userId;
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { createGoogleMapsLeadForm, updateGoogleMapsLeadForm, autoPopulateLeadForm, useGetExistingFormType, useGetLeadFormById, useGetFormsByUserAndType, isAutoPopulating } = useLeadFormHooks();
  const [autoPopulateData, setAutoPopulateData] = useState<string>('');
  const [isEditingAIInput, setIsEditingAIInput] = useState(false);

  const { mutate: triggerAutoPopulate, data: autoPopulatedResponse, isSuccess: autoPopulateSuccess } = autoPopulateLeadForm;

  // Check if we're in create mode (creating a new form) or edit mode (editing existing)
  const isCreateMode = router.query.mode === 'create';
  const formIdFromUrl = router.query.form_id as string;

  // Fetch form by ID if form_id is provided, otherwise fetch by type (gets first/default)
  const { data: formById, isSuccess: isSuccessById } = useGetLeadFormById(formIdFromUrl);
  const { data: formByType, isSuccess: isSuccessByType } = useGetExistingFormType(userId || '', FormTypeEnum.GOOGLE_MAPS);

  // Fetch all forms of this type for the selector dropdown
  const { data: allFormsOfType = [] } = useGetFormsByUserAndType(userId || '', FormTypeEnum.GOOGLE_MAPS);

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
    console.log('formIdFromUrl', formIdFromUrl);
    // Only load existing form data if NOT in create mode
    if (existingForm && isSuccess && userId && !isCreateMode) {
      const {
        form_title,
        maps_search_mode,
        maps_search_query,
        maps_location,
        maps_latitude,
        maps_longitude,
        maps_radius_km,
        maps_business_types,
        maps_min_rating,
        maps_exclude_closed,
        maps_max_results,
        lead_form_id,
        add_to_history,
        lead_generation_goal,
        monitoring_interval_hours,
      } = existingForm;

      setForm({
        user_id: userId,
        form_title,
        maps_search_mode: maps_search_mode || 'auto',
        maps_search_query: maps_search_query || '',
        maps_location: maps_location || '',
        maps_latitude,
        maps_longitude,
        maps_radius_km: maps_radius_km || 5.0,
        maps_business_types: maps_business_types || [],
        maps_min_rating,
        maps_exclude_closed: maps_exclude_closed ?? true,
        maps_max_results: maps_max_results || 20,
        add_to_history,
        lead_generation_goal,
        monitoring_interval_hours: monitoring_interval_hours || 0,
      });

      setExistingFormId(lead_form_id);
    } else if (isCreateMode) {
      // In create mode, reset form to blank state and ensure existingFormId is null
      setForm({
        user_id: userId || '',
        form_title: 'Google Maps Lead Form',
        maps_search_mode: 'auto',
        maps_search_query: '',
        maps_location: '',
        maps_latitude: undefined,
        maps_longitude: undefined,
        maps_radius_km: 5.0,
        maps_business_types: [],
        maps_min_rating: undefined,
        maps_exclude_closed: true,
        maps_max_results: 20,
        add_to_history: false,
        lead_generation_goal: '',
        monitoring_interval_hours: 0,
      });
      setExistingFormId(null);
    }
  }, [existingForm, isSuccess, userId, isCreateMode, formIdFromUrl]);

  useEffect(() => {
    if (autoPopulateSuccess && autoPopulatedResponse?.responseData) {
      const data = autoPopulatedResponse.responseData;

      setForm((prev) => ({
        ...prev,
        form_title: data.form_title || prev.form_title,
        maps_search_query: data.maps_search_query || prev.maps_search_query,
        maps_location: data.maps_location || prev.maps_location,
        maps_business_types: data.maps_business_types || prev.maps_business_types,
        maps_min_rating: data.maps_min_rating || prev.maps_min_rating,
        maps_radius_km: data.maps_radius_km || prev.maps_radius_km,
        maps_max_results: data.maps_max_results || prev.maps_max_results,
      }));

      triggerToast('success', 'Fields updated using AI-generated suggestions');
    }
  }, [autoPopulateSuccess, autoPopulatedResponse]);

  const handleChange = (field: keyof GoogleMapsLeadFormDto, value: any) => {
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
      '💡 Tip: Specific location names yield better Google Maps results',
      '🎯 Did you know? Rating filters help find high-quality businesses',
      '⚡ Pro tip: Business types narrow down your search effectively',
      '🔍 Quality leads come from precise search criteria',
    ];

    // Status progression
    const statusMessages = [
      { msg: '📋 Validating form data...', progress: 20 },
      { msg: '🗺️ Setting up Google Maps search...', progress: 40 },
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

    const payload: GoogleMapsLeadFormDto = {
      ...form,
      user_id: userId,
    };

    if (existingFormId) {
      const updatePayload: GoogleMapsLeadFormDto = {
        form_title: payload.form_title || '',
        maps_search_mode: payload.maps_search_mode || 'auto',
        maps_search_query: payload.maps_search_query || '',
        maps_location: payload.maps_location || '',
        maps_latitude: payload.maps_latitude,
        maps_longitude: payload.maps_longitude,
        maps_radius_km: payload.maps_radius_km || 5.0,
        maps_business_types: payload.maps_business_types || [],
        maps_min_rating: payload.maps_min_rating,
        maps_exclude_closed: payload.maps_exclude_closed ?? true,
        maps_max_results: payload.maps_max_results || 20,
        add_to_history: payload.add_to_history || false,
        lead_generation_goal: payload.lead_generation_goal || '',
      };

      updateGoogleMapsLeadForm.mutate(
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
          onError: async (error: any) => {
            clearInterval(tipInterval);
            clearInterval(statusInterval);
            setIsSaving(false);

            // Check if error is due to no active subscription/trial
            if (error?.response?.status === 402 || error?.response?.status === 403) {
              // Check trial status to determine which modal to show
              try {
                const trialStatusResponse = await TrialService.getTrialStatus(userId || '');
                if (trialStatusResponse.status && trialStatusResponse.responseData) {
                  const { status, hasUsedFreeTrial } = trialStatusResponse.responseData;

                  // If trial not started and user hasn't used it, show trial activation modal
                  if (status === 'not_started' && !hasUsedFreeTrial) {
                    setShowTrialActivationModal(true);
                    return;
                  }
                }
              } catch (trialError) {
                console.error('Error checking trial status:', trialError);
              }

              // Otherwise show limit exceeded modal (trial exhausted or limit reached)
              if (error?.response?.data?.limit_exceeded) {
                setShowLimitExceededModal(true);
              } else {
                triggerToast('error', error?.response?.data?.message || 'Update failed. Please try again.');
              }
            } else {
              triggerToast('error', error?.response?.data?.message || 'Update failed. Please try again.');
            }
          },
        }
      );
    } else {
      createGoogleMapsLeadForm.mutate(payload, {
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
        onError: async (error: any) => {
          clearInterval(tipInterval);
          clearInterval(statusInterval);
          setIsSaving(false);

          // Check if error is due to no active subscription/trial
          if (error?.response?.status === 402 || error?.response?.status === 403) {
            // Check trial status to determine which modal to show
            try {
              const trialStatusResponse = await TrialService.getTrialStatus(userId || '');
              if (trialStatusResponse.status && trialStatusResponse.responseData) {
                const { status, hasUsedFreeTrial } = trialStatusResponse.responseData;

                // If trial not started and user hasn't used it, show trial activation modal
                if (status === 'not_started' && !hasUsedFreeTrial) {
                  setShowTrialActivationModal(true);
                  return;
                }
              }
            } catch (trialError) {
              console.error('Error checking trial status:', trialError);
            }

            // Otherwise show limit exceeded modal (trial exhausted or limit reached)
            if (error?.response?.data?.limit_exceeded) {
              setShowLimitExceededModal(true);
            } else {
              triggerToast('error', error?.response?.data?.message || 'Creation failed. Please try again.');
            }
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
      lead_form_type: FormTypeEnum.GOOGLE_MAPS,
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
          Google Maps Lead Form
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280', mb: 4 }}>
          {existingFormId ? 'Edit your existing form' : 'Discover local businesses using Google Maps'}
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
              Type what you're trying to achieve and let AI auto-fill the form. Example: "Find coffee shops in Lagos, Nigeria."
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
              placeholder="Describe the kind of businesses you're looking for..."
            />
          </Box>

          {/* Frequency Control Section */}
          <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              How often should we search for new leads?
              <Tooltip title="Choose how frequently we should check Google Maps for new businesses matching your criteria. Select 'One-time only' for a single search, or set a recurring interval for continuous monitoring.">
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
                  <MenuItem value={24}>Once Daily</MenuItem>
                  <MenuItem value={48}>Every 2 Days</MenuItem>
                  <MenuItem value={72}>Every 3 Days</MenuItem>
                  <MenuItem value={168}>Once Weekly</MenuItem>
                  <MenuItem value={336}>Every 2 Weeks</MenuItem>
                  <MenuItem value={720}>Once Monthly</MenuItem>
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
              {form.monitoring_interval_hours !== undefined &&
                form.monitoring_interval_hours > 0 &&
                form.monitoring_interval_hours < 24 &&
                `🔄 Checks every ${form.monitoring_interval_hours} hours for new businesses.`}
              {form.monitoring_interval_hours !== undefined &&
                form.monitoring_interval_hours >= 24 &&
                form.monitoring_interval_hours < 168 &&
                `📅 Checks every ${Math.round(form.monitoring_interval_hours / 24)} day(s) for new businesses.`}
              {form.monitoring_interval_hours !== undefined &&
                form.monitoring_interval_hours >= 168 &&
                `📆 Checks every ${Math.round(form.monitoring_interval_hours / 168)} week(s) for new businesses.`}
              {form.monitoring_interval_hours === -1 && '⚙️ Enter your custom interval in hours.'}
            </Typography>
          </Box>

          {/* Search Mode Selection */}
          <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              Search Mode
              <Tooltip title="Auto: Automatically picks the best search method. Text Search: Use natural language queries. Nearby Search: Use precise coordinates and radius.">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }} />
              </Tooltip>
            </Typography>

            <FormControl fullWidth>
              <Select
                value={form.maps_search_mode || 'auto'}
                onChange={(e) => handleChange('maps_search_mode', e.target.value)}
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
                <MenuItem value="auto">Auto (Recommended)</MenuItem>
                <MenuItem value="text">Text Search (Natural Language)</MenuItem>
                <MenuItem value="nearby">Nearby Search (Coordinates + Radius)</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
              {form.maps_search_mode === 'auto' && '✨ Automatically selects the best search method based on your inputs'}
              {form.maps_search_mode === 'text' && '🔍 Natural language queries like "small businesses in Ogba"'}
              {form.maps_search_mode === 'nearby' && '📍 Precise location-based search using coordinates and radius'}
            </Typography>
          </Box>

          {/* Text Search Fields */}
          {(form.maps_search_mode === 'auto' || form.maps_search_mode === 'text') && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
              <SingleFieldInput
                label="Search Query"
                tooltip='Natural language search query. Example: "coffee shops", "restaurants", "small businesses in tech". This works like a Google Maps search.'
                placeholder="e.g. coffee shops"
                value={form.maps_search_query || ''}
                setValue={(val) => handleChange('maps_search_query', val)}
                required={false}
              />

              <SingleFieldInput
                label="Location"
                tooltip="Location name for the search. Example: 'Lagos, Nigeria', 'Ogba', 'Victoria Island'. This helps narrow down the geographic area."
                placeholder="e.g. Lagos, Nigeria"
                value={form.maps_location || ''}
                setValue={(val) => handleChange('maps_location', val)}
                required={false}
              />
            </Box>
          )}

          {/* Nearby Search Fields */}
          {(form.maps_search_mode === 'auto' || form.maps_search_mode === 'nearby') && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
              <SingleFieldInput
                label="Latitude"
                tooltip="Latitude coordinate for precise location-based search. Example: 6.5244 for Lagos"
                placeholder="e.g. 6.5244"
                value={form.maps_latitude?.toString() || ''}
                setValue={(val) => handleChange('maps_latitude', parseFloat(val) || undefined)}
                required={false}
              />

              <SingleFieldInput
                label="Longitude"
                tooltip="Longitude coordinate for precise location-based search. Example: 3.3792 for Lagos"
                placeholder="e.g. 3.3792"
                value={form.maps_longitude?.toString() || ''}
                setValue={(val) => handleChange('maps_longitude', parseFloat(val) || undefined)}
                required={false}
              />

              <SingleFieldInput
                label="Radius (km)"
                tooltip="Search radius in kilometers from the coordinates. Larger radius = more results but less precise."
                placeholder="e.g. 5.0"
                value={form.maps_radius_km?.toString() || ''}
                setValue={(val) => handleChange('maps_radius_km', parseFloat(val) || 5.0)}
                required={false}
              />
            </Box>
          )}

          {/* Common Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <Box>
              <ListValuesInput
                label="Business Types"
                tooltip="Filter by specific business types. Examples: 'restaurant', 'cafe', 'bank', 'hospital', 'gym', etc. Add multiple if needed."
                keywords={form.maps_business_types || []}
                setKeywords={(val) => handleChange('maps_business_types', val)}
                placeholder="e.g. restaurant"
              />
            </Box>

            <SingleFieldInput
              label="Minimum Rating"
              tooltip="Filter businesses by minimum Google rating (0-5 stars). Example: 4.0 for highly-rated businesses only."
              placeholder="e.g. 4.0"
              value={form.maps_min_rating?.toString() || ''}
              setValue={(val) => handleChange('maps_min_rating', parseFloat(val) || undefined)}
              required={false}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            <SingleFieldInput
              label="Maximum Results"
              tooltip="Maximum number of businesses to return per search. Default is 20. Higher numbers may take longer."
              placeholder="e.g. 20"
              value={form.maps_max_results?.toString() || ''}
              setValue={(val) => handleChange('maps_max_results', parseInt(val) || 20)}
              required={false}
            />

            <Box mt={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox
                label="Exclude closed businesses"
                checked={form.maps_exclude_closed ?? true}
                onChange={(val) => handleChange('maps_exclude_closed', val)}
                tooltip="Check this to exclude businesses that are permanently or temporarily closed from the results."
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
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
              <Tooltip title="Tell us your business objective. AI will use this to generate personalized next steps for each lead. Example: 'I want to sell POS systems to restaurants'" arrow>
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 0.5, color: '#9ca3af' }} />
              </Tooltip>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={1}
              placeholder="e.g., I want to sell POS systems to restaurants"
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
              loading={createGoogleMapsLeadForm.isLoading || updateGoogleMapsLeadForm.isLoading || isSaving}
              text={existingFormId ? 'Update Form' : 'Generate Leads'}
              loadingText={isSaving ? savingStatus : 'Saving...'}
            />

            <Button
              variant="outlined"
              onClick={() => router.push('/leads-tracking/forms/leads?type=google-maps')}
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
            {existingFormId ? 'Update your saved form details' : 'Click to start searching for local businesses matching your criteria'}
          </Typography>
        </Box>
      </Box>

      {/* Success Modal */}
      <SmartModal
        open={openSuccessModal}
        image={<Image src="/assets/images/success.png" alt="Success" width={64} height={64} />}
        mainText="Success! 🎉"
        subText={
          'Your Google Maps lead form has been successfully saved. Please wait approximately 5 minutes for your first set of leads to be generated and check your email for updates. Going forward, you will automatically receive email notifications each time new businesses matching your criteria are discovered.'
        }
        buttonText="View Leads"
        onClick={() => {
          setOpenSuccessModal(false);
          router.push('/leads-tracking/forms/leads?type=google-maps');
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

      {/* Trial Activation Modal - Shows when user tries to generate leads without active trial */}
      {userId && (
        <TrialActivationModal
          open={showTrialActivationModal}
          onClose={() => setShowTrialActivationModal(false)}
          onSuccess={() => {
            setShowTrialActivationModal(false);
            triggerToast('success', '🎉 Trial activated! You can now generate leads.');
            window.location.reload(); // Reload to fetch updated trial status
          }}
          userId={userId}
        />
      )}

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
          // Scroll to and highlight the lead goal field
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

export default GoogleMapsLeadForm;
