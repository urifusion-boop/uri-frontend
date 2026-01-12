import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import ManageAllFormsView from '@/components/lead-tracking/forms/ManageAllFormsView';

const AllFormsPage = () => {
  return (
    <DashboardLayout excludeHeader bgColor="#f9fafb">
      <SeoHead title="All Lead Forms" />
      <ManageAllFormsView />
    </DashboardLayout>
  );
};

export default AllFormsPage;
