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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-primary text-sm font-semibold tracking-wide">HOW IT WORKS</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">Three simple steps to start closing more deals.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="relative">
              <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 border border-primary/30 shadow-lg hover-lift h-full`}>
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-soft">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-4">0{index + 1}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
