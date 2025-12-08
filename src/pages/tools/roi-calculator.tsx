import Navigation from '@/components/Navigation';
import ROICalculatorComponent from '@/components/ROICalculator';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';

export default function RoiCalculatorPage() {
  return (
    <>
      <SeoHead title="ROI Calculator" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-primary font-medium mb-4 block">ROI Calculator</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Calculate Your
              <span className="text-primary"> Potential ROI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See how much revenue you could generate by identifying high-intent prospects with URI's buying signal detection.</p>
          </motion.div>

          <ROICalculatorComponent />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 bg-muted/30 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How We Calculate ROI</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3x</div>
                <p className="text-sm text-muted-foreground">Average increase in qualified leads when using intent signals</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">40%</div>
                <p className="text-sm text-muted-foreground">Higher close rate on leads identified through buying signals</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <p className="text-sm text-muted-foreground">Reduction in time spent on unqualified prospects</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
