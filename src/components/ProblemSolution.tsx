import { motion } from 'framer-motion';
import { Filter, TrendingUp } from 'lucide-react';

const ProblemSolution = () => {
  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">We Listen 24/7 So You Don't Have To</h2>
            <p className="text-lg text-muted-foreground mb-6">You can't refresh social media every 5 minutes. URI monitors your prospects all day, every day, across every platform.</p>
            <p className="text-lg text-muted-foreground mb-6">The moment someone signals intent—whether it's a job change, a complaint, or an announcement—URI captures it and alerts you instantly.</p>
            <div className="flex items-start gap-4 p-4 bg-accent rounded-xl border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Real-Time Intelligence</p>
                <p className="text-sm text-muted-foreground">Stop relying on outdated lists. Get fresh, actionable signals as they happen.</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border shadow-strong">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-bold">Signal Detection</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3 opacity-40 line-through">
                    <p className="text-sm">Random social media post...</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 opacity-40 line-through">
                    <p className="text-sm">Unrelated content...</p>
                  </div>
                  <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-primary/20 rounded-lg p-3 border-2 border-primary">
                    <p className="text-sm font-semibold">🎯 High Intent: "Looking for a new CRM solution..."</p>
                  </motion.div>
                  <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="bg-primary/20 rounded-lg p-3 border-2 border-primary">
                    <p className="text-sm font-semibold">🎯 High Intent: "Just started at Company X as Head of..."</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
