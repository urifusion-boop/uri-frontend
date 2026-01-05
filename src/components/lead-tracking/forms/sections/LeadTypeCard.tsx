import { LightThemeColors } from '@/configs/colors.config';
import { DateHelper } from '@/helpers/DateHelper';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { LeadFormDto } from '@/models/dtos/LeadFormDto';
import { useAuth } from '@/providers/AuthProvider';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HouseIcon from '@mui/icons-material/House';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface LeadTypeCardProps {
  colorMap: Record<string, string>;
}

const LeadTypeCard = ({ colorMap }: LeadTypeCardProps) => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { useGetLeadFormsByUserId, deleteLeadForm, setDefaultForm, togglePause, toggleAutoGenerate } = useLeadFormHooks();
  const { data: leadFormsData, isLoading } = useGetLeadFormsByUserId(userDetails?.userId || '');

  const iconMap: Record<string, JSX.Element> = {
    individual: <PersonIcon fontSize="small" />,
    organization: <HouseIcon fontSize="small" />,
    business: <BusinessIcon fontSize="small" />,
    conversational: <ChatBubbleIcon fontSize="small" />,
  };

  // Map backend values to display type keys
  const typeKeyMap: Record<string, string> = {
    PERSON: 'individual',
    ORGANIZATION: 'organization',
    BUSINESS: 'business',
    CONVERSATIONAL: 'conversational',
    '0': 'individual',
    '1': 'organization',
    '2': 'business',
    '3': 'conversational',
  };

  const existingMap: Record<string, LeadFormDto> = {};

  for (const form of leadFormsData || []) {
    const key = typeKeyMap[String(form.form_type).toUpperCase()];
    if (key) {
      existingMap[key] = form;
    }
  }

  const defaultForms = [
    {
      form_type: 'Individual',
      typeKey: 'individual',
      description: 'People that may be interested in your products or services',
      created_date: '',
      total_leads: 0,
      total_new_leads: 0,
    },
    {
      form_type: 'Organization',
      typeKey: 'organization',
      description: 'Companies that may be interested in your products or services.',
      created_date: '',
      total_leads: 0,
      total_new_leads: 0,
    },
    // {
    //   form_type: 'Business',
    //   typeKey: 'business',
    //   description: 'People that may be interested in your business based on social media conversations.',
    //   created_date: '',
    //   total_leads: 0,
    //   total_new_leads: 0,
    // },
    {
      form_type: 'Sales Signals',
      typeKey: 'conversational',
      description: 'Public online conversations indicating buying intent, pain, or opportunity.',
      created_date: '',
      total_leads: 0,
      total_new_leads: 0,
    },
  ];

  const finalForms = defaultForms.map((df) => {
    const existing = existingMap[df.typeKey];
    return existing
      ? {
          ...existing,
          form_type: df.form_type,
          description: df.description,
          typeKey: df.typeKey,
        }
      : df;
  });

  const handleManageClick = (typeKey: string) => {
    router.push(`/leads-tracking/forms/manage?type=${typeKey}`);
  };

  const handleViewLeads = (typeKey: string) => {
    router.push(`/leads-tracking/forms/leads?type=${typeKey}`);
  };

  // Multi-form handlers
  const handleEdit = (formId: string) => {
    const form = leadFormsData?.find((f) => f.lead_form_id === formId);
    if (form) {
      const typeKey = typeKeyMap[String(form.form_type).toUpperCase()];
      router.push(`/leads-tracking/forms/manage?type=${typeKey}&form_id=${formId}`);
    }
  };

  const handleDelete = async (formId: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      await deleteLeadForm.mutateAsync(formId);
    }
  };

  const handleSetDefault = async (formId: string) => {
    const form = leadFormsData?.find((f) => f.lead_form_id === formId);
    if (form && userDetails?.userId) {
      await setDefaultForm.mutateAsync({
        userId: userDetails.userId,
        formType: String(form.form_type),
        formId,
      });
    }
  };

  const handleTogglePause = async (formId: string, isPaused: boolean) => {
    await togglePause.mutateAsync({ formId, disabled: isPaused });
  };

  const handleToggleAutoGen = async (formId: string, isEnabled: boolean) => {
    await toggleAutoGenerate.mutateAsync({ formId, autoGenerate: isEnabled });
  };

  const handleCreate = (typeKey: string) => {
    router.push(`/leads-tracking/forms/manage?type=${typeKey}&mode=create`);
  };

  // Group forms by type
  const formsByType: Record<string, LeadFormDto[]> = {};
  for (const form of leadFormsData || []) {
    const key = typeKeyMap[String(form.form_type).toUpperCase()];
    if (key) {
      if (!formsByType[key]) formsByType[key] = [];
      formsByType[key].push(form);
    }
  }

  return (
    <Grid container spacing={3}>
      {isLoading ? (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} lg={3} xl={3}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px' }} />
            </Grid>
          ))}
        </>
      ) : (
        finalForms.map((form) => {
          const typeKey = form.typeKey;
          const color = colorMap[typeKey] || '#CD1B78';
          const formsForThisType = formsByType[typeKey] || [];

          // Always use the original card design with header
          return (
            <Grid item xs={12} sm={6} lg={4} key={typeKey}>
              <Box
                sx={{
                  borderRadius: '14px',
                  position: 'relative',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #F3F4F6',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: `0 12px 24px rgba(205, 27, 120, 0.12)`,
                    transform: 'translateY(-4px)',
                    borderColor: `${LightThemeColors.uriColor}30`,
                  },
                }}
              >
                {/* Minimal Clean Header */}
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '9px',
                          background: `${LightThemeColors.uriColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          boxShadow: `0 2px 8px ${LightThemeColors.uriColor}35`,
                        }}
                      >
                        {iconMap[typeKey]}
                      </Box>
                      <Box>
                        <Typography fontSize="17px" fontWeight={700} color="#111827" lineHeight={1.3} letterSpacing="-0.01em">
                          {form.form_type} Form
                        </Typography>
                        {formsForThisType.length > 0 && (
                          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500, mt: 0.25 }}>
                            {formsForThisType.length} form{formsForThisType.length > 1 ? 's' : ''} · {form.created_date ? DateHelper.formatDate(form.created_date) : 'Not setup'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleCreate(typeKey)}
                      size="small"
                      sx={{
                        width: 34,
                        height: 34,
                        color: LightThemeColors.uriColor,
                        '&:hover': {
                          backgroundColor: `${LightThemeColors.uriColor}10`,
                          transform: 'rotate(90deg)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ px: 2.5, py: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Stats Row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2.5,
                      px: 2,
                      py: 1.25,
                      background: '#FAFBFC',
                      borderRadius: '10px',
                      border: '1px solid #F0F1F3',
                    }}
                  >
                    <Box>
                      <Typography fontSize="9px" color="#9CA3AF" fontWeight={600} textTransform="uppercase" letterSpacing="0.8px" mb={0.25} lineHeight={1}>
                        New Leads
                      </Typography>
                      <Typography fontSize="24px" fontWeight={700} color="#10B981" lineHeight={1} letterSpacing="-0.02em">
                        {form.total_new_leads || 0}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '1px',
                        height: '32px',
                        background: 'linear-gradient(180deg, transparent 0%, #E5E7EB 20%, #E5E7EB 80%, transparent 100%)',
                      }}
                    />
                    <Box>
                      <Typography fontSize="9px" color="#9CA3AF" fontWeight={600} textTransform="uppercase" letterSpacing="0.8px" mb={0.25} lineHeight={1}>
                        Total Leads
                      </Typography>
                      <Typography fontSize="24px" fontWeight={700} color="#374151" lineHeight={1} letterSpacing="-0.02em">
                        {form.total_leads || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography
                    fontSize="13px"
                    color="#6B7280"
                    lineHeight={1.5}
                    mb={2.5}
                    flex={1}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {form.description}
                  </Typography>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleViewLeads(typeKey)}
                      sx={{
                        background: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, #a31560 100%)`,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '13px',
                        py: 1,
                        borderRadius: '8px',
                        boxShadow: `0 4px 10px ${LightThemeColors.uriColor}25`,
                        '&:hover': {
                          background: `linear-gradient(135deg, #a31560 0%, ${LightThemeColors.uriColor} 100%)`,
                          boxShadow: `0 6px 16px ${LightThemeColors.uriColor}40`,
                        },
                      }}
                    >
                      View Leads
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleManageClick(typeKey)}
                      sx={{
                        borderColor: `${LightThemeColors.uriColor}40`,
                        color: LightThemeColors.uriColor,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '13px',
                        py: 1,
                        borderRadius: '8px',
                        '&:hover': {
                          borderColor: LightThemeColors.uriColor,
                          backgroundColor: `${LightThemeColors.uriColor}08`,
                        },
                      }}
                    >
                      Manage
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })
      )}
    </Grid>
  );
};

export default LeadTypeCard;
