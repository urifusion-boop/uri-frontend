import PremiumPromptModal from '@/components/modals/PremiumPromptModal';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import ClientsDashboard from '@/pages/clients/dashboard';
import { useAuth } from '@/providers/AuthProvider';

const HomePage = () => {
  const { userDetails } = useAuth();

  // const renderBasedOnUserType = () => {
  //   if (userDetails?.userType === UserTypeEnum.BUSINESS) {
  //     return <ClientsDashboard />;
  //   } else if (userDetails?.userType === UserTypeEnum.CREATIVE) {
  //     return <CreativesDashboard />;
  //   }
  //   return null;
  // };

  return (
    <>
      <ClientsDashboard />
      {/* {userDetails?.subscriptionStatus !== SubscriptionStatusEnum.ACTIVE && <PremiumPromptModal />} */}
    </>
  );
};

export default HomePage;
