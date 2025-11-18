import DashboardLayout from '@/components/atoms/DashboardLayout';
import EmptyState from '@/components/atoms/EmptyState';
import { LightThemeColors } from '@/configs/colors.config';
import { useRouter } from 'next/router';
import { MdErrorOutline } from 'react-icons/md';
import FacebookAccountTracking from './facebook';
import InstagramInfluencerAnalytics from './instagram';
import TiktokInfluencerAnalytics from './tiktok';
import TwitterInfluencerAnalytics from './twitter';

const PlatformAnalysis = () => {
  const router = useRouter();

  const { platform } = router.query;

  switch (platform) {
    case 'instagram':
      return <InstagramInfluencerAnalytics />;
    case 'tiktok':
      return <TiktokInfluencerAnalytics />;
    case 'twitter':
      return <TwitterInfluencerAnalytics />;
    case 'facebook':
      return <FacebookAccountTracking />;
    case 'linkedin':
      return (
        <DashboardLayout>
          <EmptyState
            actionRequired
            buttonText="Back to Overview"
            heading="Unsupported Platform"
            subtitle="LinkedIn tracking is no longer available on the frontend."
            onAction={() => router.push('/account-tracking')}
            icon={<MdErrorOutline color={LightThemeColors.uriColor} size={150} />}
          />
        </DashboardLayout>
      );
    default:
      return (
        <DashboardLayout>
          <EmptyState
            actionRequired
            buttonText="Back to Overview"
            heading="Invalid Platform"
            subtitle="The platform you are trying to access is invalid."
            onAction={() => router.push('/account-tracking')}
            icon={<MdErrorOutline color={LightThemeColors.uriColor} size={150} />}
          />
        </DashboardLayout>
      );
  }
};

export default PlatformAnalysis;
