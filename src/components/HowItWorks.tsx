import { motion } from 'framer-motion';
import { Radar, Target, Zap } from 'lucide-react';

const steps = [
  {
    icon: Target,
    title: 'Define Your Target',
    description: "Type a simple prompt: 'Find people interested in real estate in Lagos' or 'Track hiring managers in tech.'",
    color: 'from-primary/20 to-secondary/20',
  },
  {
    icon: Radar,
    title: 'Detect The Signal',
    description: 'URI monitors social platforms 24/7, capturing buying signals and intent in real-time as they happen.',
    color: 'from-primary/30 to-secondary/30',
  },
  {
    icon: Zap,
    title: 'Convert with Context',
    description: 'Dera AI crafts personalized outreach based on the exact context. You review, approve, and close.',
    color: 'from-primary/40 to-secondary/40',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-stretch max-w-6xl mx-auto">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center md:text-left mb-12 sm:mb-16 px-4 md:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
                How It <span className="text-primary">Works ?</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-none mx-auto md:mx-0 mt-3">Three simple steps to start closing more deals.</p>
            </motion.div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="relative">
                  <div className="bg-card rounded-2xl p-6 border border-border border-l-4 border-primary/20 shadow-lg hover-lift">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                        <step.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xl font-bold">{step.title}</h3>
                          <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="px-4 md:px-0 h-full">
            <div className="bg-card rounded-2xl border border-border shadow-strong overflow-hidden h-full">
              <img src="/assets/images/landing/agrc2.png" alt="Agriculture Financing Needs" className="w-full h-full object-contain" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
