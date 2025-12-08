import FAQs from '@/components/FAQs';
import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';

export default function FaqsPage() {
  return (
    <>
      <SeoHead title="FAQs" />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Navigation />
        <FAQs />
        <Footer />
      </div>
    </>
  );
}
