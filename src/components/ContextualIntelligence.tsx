import { motion } from 'framer-motion';
import { ArrowRight, Bell, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ContextualIntelligence = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollByViewport = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft + (dir === 'right' ? el.clientWidth : -el.clientWidth), behavior: 'smooth' });
  };

  return (
    <section id="features" className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Capture the Leads Everyone Else Misses</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">Our AI doesn't just read—it understands context and intent.</p>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button onClick={() => scrollByViewport('left')} className="hidden md:inline-flex bg-card border border-border shadow-lg rounded-full p-2 hover:bg-muted transition-colors">
              <ArrowRight className="w-5 h-5 -scale-x-100" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button onClick={() => scrollByViewport('right')} className="hidden md:inline-flex bg-card border border-border shadow-lg rounded-full p-2 hover:bg-muted transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div ref={trackRef} className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="min-w-[88%] sm:min-w-[70%] md:min-w-[60%] lg:min-w-[45%] snap-center"
            >
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                <MessageSquare className="w-10 h-10 text-primary mb-4" />
                <div className="bg-accent p-4 rounded-xl mb-3">
                  <p className="text-sm italic">"Excited to be getting married in August! 💍"</p>
                </div>
                <p className="text-xs text-muted-foreground font-semibold">STEP 1: Social Post</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="min-w-[88%] sm:min-w-[70%] md:min-w-[60%] lg:min-w-[45%] snap-center"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 border-2 border-primary shadow-strong">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="min-w-[88%] sm:min-w-[70%] md:min-w-[60%] lg:min-w-[45%] snap-center"
            >
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
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

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`h-1.5 w-6 rounded-full ${active === 0 ? 'bg-primary' : 'bg-muted'}`}></span>
            <span className={`h-1.5 w-6 rounded-full ${active === 1 ? 'bg-primary' : 'bg-muted'}`}></span>
            <span className={`h-1.5 w-6 rounded-full ${active === 2 ? 'bg-primary' : 'bg-muted'}`}></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContextualIntelligence;
