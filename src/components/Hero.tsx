import { Button } from '@/components/ui/button';
import { authRoutes } from '@/constants/ClientRoute';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Bell, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';

const Hero = () => {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 300], [1, 0.85]);
  const contentY = useTransform(scrollY, [0, 300], [0, -40]);
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,26,121,0.08),transparent_50%)]" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={{ y: contentY }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-2xl">🌍</span>
              <span className="text-sm font-medium">Built for the nuances of the African Market.</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              URI Insights
              <span className="sr-only">—</span>
              <span className="block text-gradient">Track. Analyze. Elevate.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 max-w-2xl"
            >
              Track, analyze, and elevate your brand with data-driven insights, AI assistance, and real-time lead generation — all in one platform.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm text-muted-foreground mb-6 italic">
              If your customer is out there, we will find them.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-strong hover-lift font-semibold"
                onClick={() => router.push(authRoutes.signupAs)}
              >
                Start Free
                <span className="ml-2 text-xs opacity-70 hidden sm:inline">No credit card required</span>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-4 mt-8 max-w-xl w-full">
              <div className="rounded-xl border border-border p-4 bg-background/60 shadow-strong">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Real-time monitoring</p>
                    <p className="text-xs text-muted-foreground">Live keyword and account tracking</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 bg-background/60 shadow-strong">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm font-semibold">AI insights</p>
                    <p className="text-xs text-muted-foreground">Explain trends and next actions</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 bg-background/60 shadow-strong">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Smart alerts</p>
                    <p className="text-xs text-muted-foreground">Mentions and campaign changes</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 bg-background/60 shadow-strong">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm font-semibold">Lead generation</p>
                    <p className="text-xs text-muted-foreground">Detect warm intent signals</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
