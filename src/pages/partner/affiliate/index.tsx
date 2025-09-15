import AffiliatePartnerForm from '@/components/affiliate/AffiliatePartnerForm';
import SeoHead from '@/components/atoms/SeoHead';
import Header from '@/components/landing/Header';
import UpperFooter from '@/components/landing/UpperFooter';

function Index() {
  return (
    <>
      <SeoHead title="For Business Owners" />
      <div className="bg-[#FFF]">
        <Header />
        <div className="container">
          <AffiliatePartnerForm />
        </div>
        <UpperFooter />
      </div>
    </>
  );
}

export default Index;
