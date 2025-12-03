import { motion } from 'framer-motion';
import { Bell, Check, RefreshCw, X } from 'lucide-react';

const CRMRevitalization = () => {
  const features = [
    { feature: 'Data Type', traditional: 'Static Lists', uri: 'Real-Time Signals' },
    { feature: 'African Context', traditional: 'Poor Coverage', uri: 'Deep Local Intelligence', highlight: true },
    { feature: 'Intent Detection', traditional: 'None', uri: 'AI-Powered Context Analysis' },
    { feature: 'Updates', traditional: 'Quarterly', uri: '24/7 Real-Time' },
    { feature: 'Personalization', traditional: 'Manual', uri: 'Automated with Dera AI' },
    { feature: 'CRM Integration', traditional: 'Limited', uri: 'Native & Seamless' },
  ];

  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Turn Your 'Closed-Lost' into 'Closed-Won'</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">URI monitors your dead leads. When they show new intent, we notify you instantly.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl border border-border shadow-strong overflow-hidden">
            <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              <span className="font-semibold">Your CRM</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 text-xs">
                  <tr>
                    <th className="text-left p-3 font-semibold">Company</th>
                    <th className="text-left p-3 font-semibold">Contact</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Last Activity</th>
                    <th className="text-left p-3 font-semibold">Signal</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border opacity-30">
                    <td className="p-3">Tech Corp A</td>
                    <td className="p-3">John Doe</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded bg-muted">Closed-Lost</span>
                    </td>
                    <td className="p-3 text-muted-foreground">90 days ago</td>
                    <td className="p-3">—</td>
                  </tr>
                  <tr className="border-b border-border opacity-30">
                    <td className="p-3">Startup B</td>
                    <td className="p-3">Jane Smith</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded bg-muted">Closed-Lost</span>
                    </td>
                    <td className="p-3 text-muted-foreground">120 days ago</td>
                    <td className="p-3">—</td>
                  </tr>

                  <motion.tr initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="border-2 border-primary bg-primary/5">
                    <td className="p-3 font-semibold">FinTech Co</td>
                    <td className="p-3 font-semibold">Sarah Johnson</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-semibold">Re-Engaged</span>
                    </td>
                    <td className="p-3">Just now</td>
                    <td className="p-3">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-lg font-semibold"
                      >
                        <Bell className="w-3 h-3" />
                        New Intent
                      </motion.div>
                    </td>
                  </motion.tr>

                  <tr className="border-b border-border opacity-30">
                    <td className="p-3">Agency C</td>
                    <td className="p-3">Mike Brown</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded bg-muted">Closed-Lost</span>
                    </td>
                    <td className="p-3 text-muted-foreground">60 days ago</td>
                    <td className="p-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="p-4 bg-accent border-t border-primary/20">
              <p className="text-sm font-semibold mb-2">🎯 Intent Signal Detected:</p>
              <p className="text-sm text-muted-foreground">Sarah Johnson (FinTech Co) just posted: "Evaluating new payment infrastructure solutions for Q2 expansion."</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="my-12">
          <div className="mx-auto h-px w-24 sm:w-40 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-16 mb-10 px-4">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">Stop Buying Static Lists. Start Buying Intent.</h3>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">See how URI compares to traditional lead databases.</p>
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

export default CRMRevitalization;
