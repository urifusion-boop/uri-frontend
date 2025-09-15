import Enterprise from '@/components/landing/Enterprise';
import Header from '@/components/landing/Header';
import Pricing from '@/components/landing/Pricing';
import PricingTable from '@/components/landing/PricingTable';
import UpperFooter from '@/components/landing/UpperFooter';

function PricingPage() {
  return (
    <div className="bg-[#FFFCFE]">
      <Header />
      <div className="container">
        <Pricing />
        <Enterprise />
        <PricingTable />
      </div>

      <UpperFooter />
    </div>
  );
}

export default PricingPage;
