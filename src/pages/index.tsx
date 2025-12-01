import CRMRevitalization from '@/components/CRMRevitalization';
import CTA from '@/components/CTA';
import CaseStudy from '@/components/CaseStudy';
import ComparisonTable from '@/components/ComparisonTable';
import ContextualIntelligence from '@/components/ContextualIntelligence';
import FAQs from '@/components/FAQs';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import LivePulse from '@/components/LivePulse';
import Navigation from '@/components/Navigation';
import Pricing from '@/components/Pricing';
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
      <ProblemSolution />
      <Features />
      <ContextualIntelligence />
      <CRMRevitalization />
      <ComparisonTable />
      <HowItWorks />
      <CaseStudy />
      <Testimonials />
      <ROICalculator />
      <Pricing />
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}
