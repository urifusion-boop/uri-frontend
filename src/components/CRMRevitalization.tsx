import { AnimatePresence, motion } from 'framer-motion';
import { Check, RefreshCw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const CRMRevitalization = () => {
  const [intentActive, setIntentActive] = useState(false);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tableRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIntentActive(entry.isIntersecting);
        });
      },
      { threshold: 0.9 }
    );
    observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, []);

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
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:sticky md:top-36 md:self-start">
            <AnimatePresence mode="wait">
              {intentActive ? (
                <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Leads Revived in Real Time</h2>
                  <p className="text-lg text-muted-foreground mb-6">URI detects intent and surfaces it instantly so your team can re‑engage with context.</p>
                  <div className="flex items-start gap-4 p-4 bg-accent rounded-xl border border-primary/20">
                    <RefreshCw className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Real-Time Intelligence</p>
                      <p className="text-sm text-muted-foreground">Stop relying on stale CRM data. Get fresh, actionable signals as they happen.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="inactive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Turn Your 'Closed-Lost' into 'Closed-Won'</h2>
                  <p className="text-lg text-muted-foreground mb-6">URI monitors your prospects across platforms and revives opportunities the moment intent appears.</p>
                  <div className="flex items-start gap-4 p-4 bg-accent rounded-xl border border-primary/20">
                    <RefreshCw className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Automated Monitoring</p>
                      <p className="text-sm text-muted-foreground">We listen 24/7 so you can focus on closing deals, not refreshing feeds.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="space-y-10">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative" ref={tableRef}>
              <div className="bg-card rounded-2xl border border-border shadow-strong overflow-x-auto">
                <div className="p-6 border-b border-border">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">Stop Buying Static Lists. Start Buying Intent.</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">See how URI compares to traditional lead databases.</p>
                </div>
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
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="my-12">
          <div className="mx-auto h-px w-24 sm:w-40 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default CRMRevitalization;
