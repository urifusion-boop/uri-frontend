import PremiumPromptModal from '@/components/modals/PremiumPromptModal';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import ClientsDashboard from '@/pages/clients/dashboard';
import { useAuth } from '@/providers/AuthProvider';

const HomePage = () => {
  const { subscriptionPlanType } = useAuth();

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
      {(!subscriptionPlanType || subscriptionPlanType === SubscriptionTypeEnum.FreeTrial) && <PremiumPromptModal />}
    </>
  );
};

export default HomePage;
