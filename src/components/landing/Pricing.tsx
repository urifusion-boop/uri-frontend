import SubscriptionPlansList from '@/components/subscription/general/SubscriptionPlansList';
import { useRouter } from 'next/router';

function Pricing() {
  const router = useRouter();

  return (
    <div className="mx-4">
      <SubscriptionPlansList onSelectPlan={() => router.push('/settings?tab=subscription')} currentPlanType={undefined} />
    </div>
  );
}

export default Pricing;
