import { TextHelper } from '@/helpers/TextHelper';
import useResponsiveness from '@/hooks/useResponsiveness';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import CrownIcon from '@/utils/icon/CrownIcon';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import Text from '../atoms/CustomText';

function CustomSubscriptionHeader({ subscribed = false }: Readonly<{ subscribed?: boolean }>) {
  const { isMobile } = useResponsiveness();
  const { subscriptionPlanType } = useAuth();
  const router = useRouter();

  const getPlanColor = () => {
    console.log('subscriptionPlanType : ', subscriptionPlanType);
    switch (subscriptionPlanType) {
      case SubscriptionTypeEnum.FreeTrial:
      case SubscriptionTypeEnum.FreeTrial7Day:
      case SubscriptionTypeEnum.Social_Listening_Free:
        return '#000';
      case SubscriptionTypeEnum.Social_Listening_Paid:
        return '#CD1B78';
      case SubscriptionTypeEnum.Leads_Generation:
        return '#D67E27';
      case SubscriptionTypeEnum.Enterprise:
        return '#FFD700';
      default:
        return '#CD1B78';
    }
  };

  return (
    <Box display={{ xs: 'none', sm: 'block' }} style={{ marginRight: '30px', marginLeft: '30px' }}>
      <Box
        borderRadius={'10px'}
        bgcolor={'#CD1B78'}
        display={'flex'}
        alignItems={'center'}
        onClick={() => !subscribed && router.push('/pricing')}
        sx={{
          gap: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 3 },
          cursor: subscribed ? 'default' : 'pointer',
          '&:hover': {
            bgcolor: subscribed ? '#CD1B78' : '#B81669',
          },
          transition: 'background-color 0.2s',
        }}
      >
        {/* <PremiumInverseIcon /> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '30px',
            width: '30px',
            backgroundColor: '#fff',
            borderRadius: '50%',
          }}
        >
          <CrownIcon size={18} color={getPlanColor()} />
        </Box>
        {!isMobile && (
          <Box>
            {subscribed ? (
              <Text size={isMobile ? 12 : 16} weight={600} color="#fff">
                {TextHelper.removeChar(subscriptionPlanType ?? '', '_')} Plan
              </Text>
            ) : (
              <>
                <Text size={isMobile ? 10 : 16} weight={500} color="#fff">
                  Upgrade to URI Premium
                </Text>
                <Text size={11} weight={500} color="#fff">
                  Get access to all premium content!{' '}
                </Text>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CustomSubscriptionHeader;
