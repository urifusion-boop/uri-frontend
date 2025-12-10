import CRMRevitalization from '@/components/CRMRevitalization';
import ContextualIntelligence from '@/components/ContextualIntelligence';
import FAQs from '@/components/FAQs';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import LivePulse from '@/components/LivePulse';
import Navigation from '@/components/Navigation';
import ProblemSolution from '@/components/ProblemSolution';
import ROICalculator from '@/components/ROICalculator';
import Testimonials from '@/components/Testimonials';
import TopBrands from '@/components/TopBrands';
import Footer from '@/components/landing/Footer';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <LivePulse />
      <TopBrands />
      <ContextualIntelligence />
      <ProblemSolution />
      {/* <Features /> */}
      {/* <ShowcaseSections /> */}
      <CRMRevitalization />
      <HowItWorks />
      {/* <CaseStudy /> */}
      <Testimonials />
      <ROICalculator />
      <FAQs />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
}
