import { TextHelper } from '@/helpers/TextHelper';
import useResponsiveness from '@/hooks/useResponsiveness';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { useAuth } from '@/providers/AuthProvider';
import CrownIcon from '@/utils/icon/CrownIcon';
import { Box } from '@mui/material';
import Text from '../atoms/CustomText';

function CustomSubscriptionHeader({ subscribed = false }: Readonly<{ subscribed?: boolean }>) {
  const { isMobile } = useResponsiveness();
  const { subscriptionPlanType } = useAuth();

  const getPlanColor = () => {
    console.log('subscriptionPlanType : ', subscriptionPlanType);
    switch (subscriptionPlanType) {
      case SubscriptionTypeEnum.FreeTrial:
        return '#000';
      case SubscriptionTypeEnum.Standard:
      case SubscriptionTypeEnum.StandardAnnually:
        return '#CD1B78';
      case SubscriptionTypeEnum.Professional:
      case SubscriptionTypeEnum.ProfessionalAnnually:
        return '#D67E27';
      case SubscriptionTypeEnum.Business:
      case SubscriptionTypeEnum.BusinessAnnually:
        return '#C0C0C0';
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
        sx={{
          gap: { xs: 1, sm: 2 },
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 3 },
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
