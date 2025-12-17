import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import { WalletPage as WalletPageComponent } from '@/components/wallet/WalletPage';

const WalletPage = () => {
  return (
    <DashboardLayout>
      <SeoHead title="Wallet & Billing" />
      <WalletPageComponent />
    </DashboardLayout>
  );
};

export default WalletPage;
