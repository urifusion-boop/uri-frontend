import SubscriptionPlanTable from '../../../components/admin/SubscriptionPlanTable';
import DashboardLayout from '../../../components/atoms/DashboardLayout';
import SeoHead from '../../../components/atoms/SeoHead';

const SubscriptionPlanPage = () => {
  return (
    <>
      <SeoHead title="Subscription Plans" />

      <DashboardLayout>
        <div className="body__overlay"></div>
        <div className="app__slide-wrapper">
          <SubscriptionPlanTable />
        </div>
      </DashboardLayout>
    </>
  );
};

export default SubscriptionPlanPage;
