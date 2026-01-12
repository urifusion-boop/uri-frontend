import DashboardLayout from '@/components/atoms/DashboardLayout';
import SummaryCard from '@/components/cards/SummaryCard';
import LeadSearchHeader from '@/components/lead-tracking/forms/sections/LeadSearchHeader';
import LeadTypeGrid from '@/components/lead-tracking/forms/sections/LeadTypeGrid';
import TrackLimit from '@/components/trackers/TrackLimit';
import { LightThemeColors } from '@/configs/colors.config';
import { isFeatureUnlimited } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const LeadsIndexPage = () => {
  const { subscriptionPlanType } = useAuth();
  const router = useRouter();

  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLimitInitialState = useFeatureLimitStore((state) => state.isInitialState);
  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <DashboardLayout excludeHeader={true} bgColor="#f9fafb">
        <Container maxWidth="xl" sx={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} md={8} lg={9} pt={4}>
            <LeadSearchHeader />
            {/* Summary Section */}
            <Grid container spacing={2} mt={2} bgcolor="#f9fafb" p={2} borderRadius={2}>
              <Grid item md={2.5} xs={12} className="tour-lead-total">
                <SummaryCard count={(featureLimit?.lead?.noOfLeads?.limit ?? 0) - (featureLimit?.lead?.noOfLeads?.count ?? 0)} label="No of Leads Remaining" />
              </Grid>
              <Grid item md={2.5} xs={12} className="tour-lead-total">
                <SummaryCard
                  count={(featureLimit?.lead?.credits?.limit ?? 0) - (featureLimit?.lead?.credits?.count ?? 0)}
                  label="Credit Balance"
                  tooltipText={`1 Credit = Unlock 1 Email Address\n 9 Credits = Unlock 1 Phone Number`}
                />
              </Grid>
              {!isLimitInitialState && (
                <Grid item md={7} xs={12} className="tour-keyword-limit">
                  <TrackLimit
                    planName={TextHelper.removeChar(subscriptionPlanType ?? '', '_')}
                    planLimit={featureLimit?.lead?.noOfLeads?.limit}
                    currentUsage={featureLimit?.lead?.noOfLeads?.count}
                    description={`This plan allows you to track ${isFeatureUnlimited(featureLimit?.lead?.noOfLeads?.limit) ? 'unlimited.\n 1 Credit = Unlock 1 Email Address\n 9 Credits = Unlock 1 Phone Number' : featureLimit?.lead?.noOfLeads?.limit} leads.`}
                  />
                </Grid>
              )}
            </Grid>

            {/* Section Header with Manage All Forms Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 5,
                mb: 3,
                pb: 2,
                borderBottom: '2px solid #F3F4F6',
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: { xs: '20px', md: '24px' },
                  }}
                >
                  Your Lead Forms
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    fontSize: '14px',
                    mt: 0.5,
                  }}
                >
                  Create and manage forms to generate quality leads
                </Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/leads-tracking/forms/all')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: LightThemeColors.uriColor,
                  color: LightThemeColors.uriColor,
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  fontSize: '14px',
                  '&:hover': {
                    borderColor: '#a31560',
                    backgroundColor: '#FFF5FB',
                  },
                }}
              >
                Manage All Forms
              </Button>
            </Box>

            <LeadTypeGrid />
          </Grid>
        </Container>
      </DashboardLayout>
    </Box>
  );
};

export default LeadsIndexPage;
