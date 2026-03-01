import SeoHead from '@/components/atoms/SeoHead';
import FormTypeSelector from '@/components/lead-tracking/forms/FormTypeSelector';
import { default as IndividualLeadForm } from '@/components/lead-tracking/forms/IndividualLeadForm';
import OrganizationLeadForm from '@/components/lead-tracking/forms/OrganizationLeadForm';
import { LeadHelper } from '@/helpers/LeadHelper';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { useAuth } from '@/providers/AuthProvider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BusinessLeadForm from './BusinessLeadForm';
import ConversationLeadForm from './ConversationLeadForm';
import GoogleMapsLeadForm from './GoogleMapsLeadForm';

const GenerateLeadForm = () => {
  const router = useRouter();
  const [selectedFormType, setSelectedFormType] = useState<string>('individual');
  const { userDetails } = useAuth();
  const userId = userDetails?.userId;

  const { useGetFormsByUserAndType, deleteLeadForm } = useLeadFormHooks();

  // Convert selectedFormType to FormTypeEnum for API call
  const formTypeEnum = LeadHelper.getFormTypeFromUrlParam(selectedFormType);

  // Fetch all forms for the selected type
  const { data: formsForType = [] } = useGetFormsByUserAndType(userId || '', formTypeEnum);

  useEffect(() => {
    const type = router.query.type as string;
    if (type) {
      setSelectedFormType(type);
    }
  }, [router.query.type]);

  const handleTypeSelect = (type: string) => {
    setSelectedFormType(type);

    // Remove form_id and mode when switching types to load the default form for the new type
    const { form_id, mode, ...restQuery } = router.query;

    // Update URL query parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...restQuery, type },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSwitchToCreateMode = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, mode: 'create' },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSwitchToEditMode = () => {
    const { mode, ...queryWithoutMode } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: queryWithoutMode,
      },
      undefined,
      { shallow: true }
    );
  };

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

  const handleDeleteForm = (e: React.MouseEvent, formId: string) => {
    e.stopPropagation(); // Prevent dropdown from closing

    if (confirm('Are you sure you want to delete this form? This will also delete all associated leads.')) {
      deleteLeadForm.mutate(formId, {
        onSuccess: () => {
          // If we deleted the currently selected form, redirect to the first remaining form or create mode
          if (router.query.form_id === formId) {
            const remainingForms = formsForType.filter((f: any) => f.lead_form_id !== formId);
            if (remainingForms.length > 0) {
              handleFormSelect(remainingForms[0].lead_form_id);
            } else {
              handleSwitchToCreateMode();
            }
          }
        },
      });
    }
  };

  const isCreateMode = router.query.mode === 'create';
  const isEditMode = !isCreateMode && router.query.type;
  const hasMultipleForms = formsForType.length > 1;

  // Get the currently selected form
  const currentFormId = router.query.form_id as string;
  const currentForm = formsForType.find((f: any) => f.lead_form_id === currentFormId) || formsForType[0];

  const renderForm = () => {
    console.log('selectedFormType', selectedFormType);
    switch (selectedFormType) {
      case 'individual':
        return <IndividualLeadForm key="individual" />;
      case 'organization':
        return <OrganizationLeadForm key="organization" />;
      case 'business':
        return <BusinessLeadForm key="business" />;
      case 'conversational':
        return <ConversationLeadForm key="conversational" />;
      case 'googlemaps':
      case 'google-maps':
        return <GoogleMapsLeadForm key="googlemaps" />;
      default:
        return <IndividualLeadForm key="individual-default" />;
    }
  };

  return (
    <>
      <SeoHead title="Lead Generation" />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fff', py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1f2937',
              mb: 1,
              fontSize: { xs: '24px', md: '32px' },
            }}
          >
            Let&apos;s Build Your Perfect Lead Form!
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '15px' }}>
            Select the lead type, customize your input fields, and get ready for AI-powered lead tracking
          </Typography>
        </Box>

        <FormTypeSelector selectedType={selectedFormType} onTypeSelect={handleTypeSelect} />

        {isEditMode && (
          <Box sx={{ mt: 3, maxWidth: '900px', mx: 'auto', px: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFF5FB',
                border: '1px solid #F8BBE0',
                borderLeft: '3px solid #CD1B78',
                borderRadius: '8px',
                px: 2.5,
                py: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EditIcon sx={{ fontSize: 18, color: '#CD1B78' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '14px', color: '#6b7280' }}>
                    {currentForm ? (
                      <>
                        Editing <strong style={{ color: '#374151' }}>"{currentForm.form_title}"</strong>
                        {hasMultipleForms && <span> (1 of {formsForType.length})</span>}
                      </>
                    ) : (
                      'Editing existing form'
                    )}
                  </Typography>
                  {!hasMultipleForms && (
                    <Typography variant="caption" sx={{ fontSize: '12px', color: '#9ca3af' }}>
                      Want to create a new one?
                    </Typography>
                  )}
                </Box>
              </Box>
              <Button
                size="small"
                variant="text"
                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                onClick={handleSwitchToCreateMode}
                sx={{
                  color: '#CD1B78',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '13px',
                  px: 2,
                  py: 0.75,
                  '&:hover': {
                    backgroundColor: '#CD1B7810',
                  },
                }}
              >
                Create New
              </Button>
            </Box>

            {/* Form Selector Dropdown - Show when multiple forms exist */}
            {hasMultipleForms && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#6b7280', mb: 1, display: 'block', fontWeight: 500 }}>
                  Select Form to Edit ({formsForType.length} forms available)
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={(typeof router.query.form_id === 'string' ? router.query.form_id : router.query.form_id?.[0]) || formsForType[0]?.lead_form_id || ''}
                    onChange={(e) => handleFormSelect(e.target.value)}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#CD1B78',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#CD1B78',
                      },
                    }}
                  >
                    {formsForType.map((form: any) => (
                      <MenuItem key={form.lead_form_id} value={form.lead_form_id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {form.form_title}
                            </Typography>
                            {form.is_default && (
                              <Typography
                                variant="caption"
                                sx={{
                                  backgroundColor: '#CD1B78',
                                  color: '#fff',
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                }}
                              >
                                DEFAULT
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => handleDeleteForm(e, form.lead_form_id)}
                            sx={{
                              ml: 1,
                              color: '#ef4444',
                              '&:hover': {
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        )}

        {isCreateMode && (
          <Box sx={{ mt: 3, maxWidth: '900px', mx: 'auto', px: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFFBF5',
                border: '1px solid #FED7AA',
                borderLeft: '3px solid #F97316',
                borderRadius: '8px',
                px: 2.5,
                py: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AddIcon sx={{ fontSize: 18, color: '#F97316' }} />
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#6b7280' }}>
                  Creating new form. Want to edit existing instead?
                </Typography>
              </Box>
              <Button
                size="small"
                variant="text"
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                onClick={handleSwitchToEditMode}
                sx={{
                  color: '#F97316',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '13px',
                  px: 2,
                  py: 0.75,
                  '&:hover': {
                    backgroundColor: '#F9731610',
                  },
                }}
              >
                Edit Existing
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>{renderForm()}</Box>
      </Box>
    </>
  );
};

export default GenerateLeadForm;
