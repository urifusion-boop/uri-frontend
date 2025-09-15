import FeatureTable from '../../../components/admin/FeatureTable';
import DashboardLayout from '../../../components/atoms/DashboardLayout';
import SeoHead from '../../../components/atoms/SeoHead';

const FeaturesPage = () => {
  return (
    <>
      <SeoHead title="Features" />

      <DashboardLayout>
        <div className="body__overlay"></div>
        <div className="app__slide-wrapper">
          <FeatureTable />
        </div>
      </DashboardLayout>
    </>
  );
};

export default FeaturesPage;
