import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import useResponsiveness from '@/hooks/useResponsiveness';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import useCustomTheme from '../../hooks/theme.hook';

function Pricing() {
  const { themeColors } = useCustomTheme();
  const { isTablet } = useResponsiveness();
  const router = useRouter();

  return (
    <div className="mx-4">
      <Grid mb={4} display={'grid'} justifyContent={isTablet ? 'start' : 'center'}>
        {/* <h2 className="text-[#CD1B78] text-xl font-semibold mx-auto">PRICING</h2> */}
        <h3 className="text-[#000000] text-[32px] md:text-[48px] font-bold mx-auto py-2 text-center">
          Choose your <span className="text-[#CD1B78]"> Perfect</span> Plan
        </h3>

        <p className="max-w-[959px] mx-auto text-center text-[#080808] text-lg md:text-[24px] mt-1 font-urbanist font-medium leading-snug">
          Whether you&apos;re just starting out or scaling up, we&apos;ve got the perfect plan.
        </p>
      </Grid>
      <SubscriptionPlansList selectedPlan={'selectedPlan'} onSelectPlan={() => router.push('/settings?tab=subscription')} />
    </div>
  );
}

export default Pricing;
