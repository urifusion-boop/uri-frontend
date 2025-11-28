import { motion } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';

const CRMRevitalization = () => {
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
      </div>
    </section>
  );
};

export default CRMRevitalization;
