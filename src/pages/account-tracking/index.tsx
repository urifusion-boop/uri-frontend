import DashboardLayout from '@/components/atoms/DashboardLayout';
import FeatureLimitLock from '@/components/atoms/FeatureLimitLock';
import InfluencerProfiles from '@/components/atoms/InfluencerProfiles';
import InsightsAssistantButton from '@/components/atoms/InsightsAssistantButton';
import SeoHead from '@/components/atoms/SeoHead';
import { isFeatureLocked } from '@/configs/rules.config';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';

const Overview = () => {
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  return (
    <>
      <SeoHead title="Account Tracking" />
      <DashboardLayout bgColor="#f8f8f8" excludeHeader={true}>
        {!isFeatureLocked(featureLimit, 'accountTracking') ? (
          <>
            <InfluencerProfiles />
            {/* Quietly integrated Insights Assistant */}
            <InsightsAssistantButton context="account-tracking" />
          </>
        ) : (
          <FeatureLimitLock />
        )}
      </DashboardLayout>
    </>
  );
};

export default Overview;
