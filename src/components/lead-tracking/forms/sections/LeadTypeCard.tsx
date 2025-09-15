import { LightThemeColors } from '@/configs/colors.config';
import { DateHelper } from '@/helpers/DateHelper';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { LeadFormDto } from '@/models/dtos/LeadFormDto';
import { useAuth } from '@/providers/AuthProvider';
import BusinessIcon from '@mui/icons-material/Business';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const { useGetLeadFormsByUserId } = useLeadFormHooks();
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
    {
      form_type: 'Business',
      typeKey: 'business',
      description: 'People that may be interested in your business based on social media conversations.',
      created_date: '',
      total_leads: 0,
      total_new_leads: 0,
    },
    {
      form_type: 'Conversational',
      typeKey: 'conversational',
      description: 'Detect sales signals andconversations about your business, products or services.',
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

  return (
    <Grid container spacing={3}>
      {isLoading ? (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} lg={4} xl={4}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px' }} />
            </Grid>
          ))}
        </>
      ) : (
        finalForms.map((form) => {
          const typeKey = form.typeKey;
          const color = colorMap[typeKey] || '#CD1B78';

          return (
            <Grid item xs={12} sm={6} lg={3} xl={6} key={typeKey}>
              <Box
                sx={{
                  border: `3px solid ${color}`,
                  borderRadius: '12px',
                  p: 3,
                  position: 'relative',
                  background: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                {form?.form_type && (
                  <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12, color: '#fff' }}>
                    {form?.form_type && (
                      <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12, color: LightThemeColors.uriColor }}>
                        {iconMap[typeKey] || <DeleteIcon fontSize="small" />}
                      </IconButton>
                    )}
                  </IconButton>
                )}

                <Typography fontWeight={700} fontSize="16px" mb={1} color={'#374151'}>
                  {form.form_type} Lead Form
                </Typography>

                <Typography fontSize="13px" color="green" fontWeight={600} mb={0.5}>
                  {form.total_new_leads || 0} New{' '}
                  <Typography component="span" color="textSecondary">
                    • {form.total_leads || 0} Total
                  </Typography>
                </Typography>

                <Typography fontSize="12px" color="#6b7280" mb={1}>
                  {form.created_date ? `Date Created: ${DateHelper.formatDate(form.created_date)}` : 'Not setup yet'}
                </Typography>

                <Typography fontSize="13px" color="#374151" mb={2}>
                  {form.description}
                </Typography>

                <Box display="flex" gap={1}>
                  <Button size="small" variant="contained" sx={{ backgroundColor: color, textTransform: 'none' }} onClick={() => handleViewLeads(typeKey)}>
                    View Leads
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleManageClick(typeKey)} sx={{ borderColor: color, color: color, textTransform: 'none' }}>
                    Manage Form
                  </Button>
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
