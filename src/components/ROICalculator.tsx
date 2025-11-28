import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ROICalculator = () => {
  const [leads, setLeads] = useState<number>(100);
  const [conversion, setConversion] = useState<number>(10);
  const [dealSize, setDealSize] = useState<number>(50000);

  const monthlyRevenue = Math.round(leads * (conversion / 100) * dealSize);

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-primary text-sm font-semibold">ROI CALCULATOR</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">Estimate your potential ROI</h2>
            <p className="text-muted-foreground mt-3">Adjust the inputs to see how URI can impact monthly revenue.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-medium mb-2">Monthly qualified leads</p>
              <div className="text-2xl font-bold mb-4">{leads}</div>
              <Slider value={[leads]} min={0} max={1000} step={10} onValueChange={(v) => setLeads(v[0])} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-medium mb-2">Conversion rate (%)</p>
              <div className="text-2xl font-bold mb-4">{conversion}%</div>
              <Slider value={[conversion]} min={0} max={50} step={1} onValueChange={(v) => setConversion(v[0])} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-medium mb-2">Average deal size (₦)</p>
              <div className="text-2xl font-bold mb-4">₦{dealSize.toLocaleString()}</div>
              <Slider value={[dealSize]} min={10000} max={1000000} step={5000} onValueChange={(v) => setDealSize(v[0])} />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
            <p className="text-sm font-medium">Estimated monthly revenue</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2">₦{monthlyRevenue.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROICalculator;
