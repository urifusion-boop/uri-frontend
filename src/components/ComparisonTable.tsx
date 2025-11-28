import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const ComparisonTable = () => {
  const features = [
    { feature: 'Data Type', traditional: 'Static Lists', uri: 'Real-Time Signals' },
    { feature: 'African Context', traditional: 'Poor Coverage', uri: 'Deep Local Intelligence', highlight: true },
    { feature: 'Intent Detection', traditional: 'None', uri: 'AI-Powered Context Analysis' },
    { feature: 'Updates', traditional: 'Quarterly', uri: '24/7 Real-Time' },
    { feature: 'Personalization', traditional: 'Manual', uri: 'Automated with Dera AI' },
    { feature: 'CRM Integration', traditional: 'Limited', uri: 'Native & Seamless' },
  ];

  return (
    <section id="solutions" className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Stop Buying Static Lists. Start Buying Intent.</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">See how URI compares to traditional lead databases.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-strong overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 sm:p-6 font-bold text-sm sm:text-base md:text-lg">Feature</th>
                  <th className="text-left p-3 sm:p-6 font-semibold text-xs sm:text-sm md:text-base">Traditional Databases</th>
                  <th className="text-left p-3 sm:p-6 font-semibold bg-primary/5 border-l-4 border-primary text-xs sm:text-sm md:text-base">URI (Contextual Intelligence)</th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-border ${item.highlight ? 'bg-accent/50' : ''}`}
                  >
                    <td className="p-3 sm:p-6 font-medium text-xs sm:text-sm md:text-base">{item.feature}</td>
                    <td className="p-3 sm:p-6">
                      <div className="flex items-center gap-2">
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-destructive flex-shrink-0" />
                        <span className="text-muted-foreground text-xs sm:text-sm md:text-base">{item.traditional}</span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-6 bg-primary/5 border-l-4 border-primary">
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                        <span className="font-semibold text-xs sm:text-sm md:text-base">{item.uri}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
