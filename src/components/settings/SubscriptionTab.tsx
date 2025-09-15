import { LightThemeColors } from '@/configs/colors.config';
import { useActiveSubscription } from '@/hooks/subscription/activeSubscription.hook';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import { Box } from '@mui/material';
import Spinner from '../loaders/Spinner';
import HasActiveSubscription from '../subscription/HasActiveSubscription';
import NewSubscription from '../subscription/NewSubscription';

const SubscriptionTab = () => {
  const { userDetails } = useAuth();
  const { activeSubscription, isLoadingActiveSubscription } = useActiveSubscription();

  if (isLoadingActiveSubscription)
    return (
      <Box>
        <Spinner color={LightThemeColors.uriColor} />
      </Box>
    );

  return userDetails?.subscriptionStatus === SubscriptionStatusEnum.ACTIVE ? <HasActiveSubscription activeSubscription={activeSubscription} /> : <NewSubscription />;
};

export default SubscriptionTab;
