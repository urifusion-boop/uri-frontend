import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import { useRouter } from 'next/router';

function Pricing() {
  const router = useRouter();

  return (
    <div className="mx-4">
      <SubscriptionPlansList selectedPlan={'selectedPlan'} onSelectPlan={() => router.push('/settings?tab=subscription')} />
    </div>
  );
}

export default Pricing;
