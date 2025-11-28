import { motion } from 'framer-motion';
import { ArrowRight, Bell, Brain, MessageSquare, Sparkles } from 'lucide-react';

const ContextualIntelligence = () => {
  return (
    <section id="features" className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Capture the Leads Everyone Else Misses</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Our AI doesn't just read—it understands context and intent.</p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg hover-lift">
                <MessageSquare className="w-10 h-10 text-primary mb-4" />
                <div className="bg-accent p-4 rounded-xl mb-3">
                  <p className="text-sm italic">"Excited to be getting married in August! 💍"</p>
                </div>
                <p className="text-xs text-muted-foreground font-semibold">STEP 1: Social Post</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 border-2 border-primary shadow-strong hover-lift">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Brain className="w-10 h-10 text-primary mb-4 mx-auto" />
                </motion.div>
                <div className="bg-background/80 p-4 rounded-xl mb-3 backdrop-blur">
                  <p className="text-sm font-semibold text-center">Event: Wedding Detected</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs">Analyzing context...</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-semibold text-center">STEP 2: URI AI Analysis</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg hover-lift">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Bell className="w-10 h-10 text-primary mb-4" />
                </motion.div>
                <div className="bg-primary/10 p-4 rounded-xl mb-3 border border-primary/30">
                  <p className="text-sm font-semibold mb-2">Implied Need Detected</p>
                  <p className="text-xs text-muted-foreground">Bespoke Tailoring, Wedding Photography, Event Planning</p>
                  <button className="mt-3 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">Pitch Now →</button>
                </div>
                <p className="text-xs text-muted-foreground font-semibold">STEP 3: Actionable Insight</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContextualIntelligence;
