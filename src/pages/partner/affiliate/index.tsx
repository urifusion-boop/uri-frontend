import AffiliatePartnerForm from '@/components/affiliate/AffiliatePartnerForm';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';

function Index() {
  return (
    <>
      <SeoHead title="For Business Owners" />
      <div className="bg-[#FFF]">
        <Navigation />
        <div className="container">
          <AffiliatePartnerForm />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Index;
