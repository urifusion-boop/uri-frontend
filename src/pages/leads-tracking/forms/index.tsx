import DashboardLayout from '@/components/atoms/DashboardLayout';
import SummaryCard from '@/components/cards/SummaryCard';
import LeadSearchHeader from '@/components/lead-tracking/forms/sections/LeadSearchHeader';
import LeadTypeGrid from '@/components/lead-tracking/forms/sections/LeadTypeGrid';
import TrackLimit from '@/components/trackers/TrackLimit';
import { isFeatureUnlimited } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { Box, Container, Grid } from '@mui/material';

const LeadsIndexPage = () => {
  const { subscriptionPlanType } = useAuth();

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
            <Box mt={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}></Box>
            <LeadTypeGrid />
          </Grid>
        </Container>
      </DashboardLayout>
    </Box>
  );
};

export default LeadsIndexPage;
