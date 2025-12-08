import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ROICalculator = () => {
  const [monthlyLeads, setMonthlyLeads] = useState(0);
  const [conversionRate, setConversionRate] = useState(3);
  const [avgDealSize, setAvgDealSize] = useState(100000);

  const estimatedRevenue = Math.round(monthlyLeads * (conversionRate / 100) * avgDealSize);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wide mb-4 block">ROI Calculator</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Estimate your potential ROI</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Adjust the inputs to see how URI can impact monthly revenue.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Monthly Qualified Leads */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <label className="text-sm font-medium text-foreground block mb-2">Monthly qualified leads</label>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-6">{monthlyLeads}</div>
            <Slider value={[monthlyLeads]} onValueChange={(value) => setMonthlyLeads(value[0])} min={0} max={500} step={5} className="w-full" />
          </div>

          {/* Conversion Rate */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <label className="text-sm font-medium text-foreground block mb-2">Conversion rate (%)</label>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-6">{conversionRate}%</div>
            <Slider value={[conversionRate]} onValueChange={(value) => setConversionRate(value[0])} min={1} max={30} step={1} className="w-full" />
          </div>

          {/* Average Deal Size */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <label className="text-sm font-medium text-foreground block mb-2">Average deal size (₦)</label>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-6">{formatCurrency(avgDealSize).replace('NGN', '₦')}</div>
            <Slider value={[avgDealSize]} onValueChange={(value) => setAvgDealSize(value[0])} min={10000} max={5000000} step={10000} className="w-full" />
          </div>
        </motion.div>

        {/* Estimated Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-primary/10 rounded-2xl p-8 text-center"
        >
          <p className="text-muted-foreground text-sm mb-2">Estimated monthly revenue</p>
          <motion.div
            key={estimatedRevenue}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
          >
            {formatCurrency(estimatedRevenue).replace('NGN', '₦')}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROICalculator;
