import { AspectRatio } from '@/components/ui/aspect-ratio';
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
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start max-w-6xl mx-auto">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center md:text-left mb-12 sm:mb-16 px-4 md:px-0">
              <p className="text-primary text-sm font-semibold tracking-wide">HOW IT WORKS</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
                How It <span className="text-primary">Works</span>
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

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="px-4 md:px-0">
            <div className="bg-card rounded-2xl border border-border shadow-strong overflow-hidden">
              <AspectRatio ratio={16 / 10}>
                <img src="/assets/images/landing/Agriculture_Financing_Needs.png" alt="Agriculture Financing Needs" className="w-full h-full object-cover" />
              </AspectRatio>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="max-w-5xl mx-auto mt-12">
          <div className="bg-background border-2 border-border rounded-2xl shadow-strong overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                <span className="text-xs font-medium">Get Started On URI</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">How do I schedule posts across my social media platforms?</h3>
              <p className="text-sm text-muted-foreground mb-4">The video below provides step-by-step guide to start using URI.</p>
            </div>
            <div className="px-2 sm:px-3 pb-4 sm:pb-6">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  className="w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/1qpvBioMUME?rel=0"
                  title="Get Started on URI"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </AspectRatio>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
