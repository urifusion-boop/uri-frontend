import DashboardLayout from '@/components/atoms/DashboardLayout';
import SummaryCard from '@/components/cards/SummaryCard';
import FeatureHeader from '@/components/lead-tracking/FeatureHeader';
import FormSnapshotTab from '@/components/lead-tracking/FormSnapshotTab';
import TrackLimit from '@/components/trackers/TrackLimit';
import { isFeatureUnlimited } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { Grid, useMediaQuery } from '@mui/material';

const LeadsIndexPage = () => {
  const { subscriptionPlanType } = useAuth();

  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLimitInitialState = useFeatureLimitStore((state) => state.isInitialState);
  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <DashboardLayout excludeHeader={true} bgColor="#f9fafb">
      <FeatureHeader isMobile={isMobile} title="Form History" onClick={() => {}} loading={false} buttonText={''} onExportClick={() => {}} startTour={() => {}} allowExport={false} />
      {/* Summary Section */}
      <Grid container spacing={2} mb={2} mt={2} bgcolor="#f9fafb" p={2} borderRadius={2}>
        <Grid item md={2.5} xs={12} className="tour-lead-total">
          <SummaryCard
            count={isFeatureUnlimited(featureLimit?.lead?.noOfLeads?.limit) ? '∞' : (featureLimit?.lead?.noOfLeads?.limit ?? 0) - (featureLimit?.lead?.noOfLeads?.count ?? 0)}
            label="No of Leads Remaining"
          />
        </Grid>
        <Grid item md={2.5} xs={12} className="tour-lead-total">
          <SummaryCard
            count={isFeatureUnlimited(featureLimit?.lead?.credits?.limit) ? '∞' : (featureLimit.lead?.credits?.limit ?? 0) - (featureLimit?.lead?.credits?.count ?? 0)}
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
      <FormSnapshotTab />
    </DashboardLayout>
  );
};

export default LeadsIndexPage;
