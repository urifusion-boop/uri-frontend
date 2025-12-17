import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bell, Brain, Magnet, MapPin, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SignalDetectionPage() {
  return (
    <>
      <SeoHead title="Signal Detection" />
      <Navigation />
      <main className="bg-background pt-24">
        <HeroSection />
        <SemanticLogicSection />
        <SignalConfigSection />
        <LiveSignalFeed />
        <UseCaseCarousel />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

function HeroSection() {
  const [dots, setDots] = useState<Array<{ id: number; x: number; y: number; isSignal: boolean }>>([]);

  useEffect(() => {
    const initialDots = Array.from({ length: 100 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, isSignal: false }));
    setDots(initialDots);
    const interval = setInterval(() => {
      setDots((prev) => prev.map((dot) => (Math.random() > 0.97 ? { ...dot, isSignal: !dot.isSignal } : dot)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-20 px-4 overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Stop Searching for Keywords.
          <br />
          <span className="text-primary">Start Detecting Intent.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Most tools only find exact matches. URI understands the context behind the post to find hidden buying signals 24/7.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-96 max-w-4xl mx-auto rounded-2xl backdrop-blur-md bg-white/70 shadow-xl border border-border/50 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-primary/10 p-6 rounded-full">
              <Magnet className="w-12 h-12 text-primary" />
            </div>
          </div>
          {dots.map((dot) => (
            <motion.div
              key={dot.id}
              className={`absolute w-2 h-2 rounded-full ${dot.isSignal ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              animate={{ scale: dot.isSignal ? [1, 1.5, 1] : 1, opacity: dot.isSignal ? [0.5, 1, 0.5] : 0.3 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SemanticLogicSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-16">
          How the AI <span className="text-primary">Thinks</span>
        </motion.h2>
        <div className="p-8 backdrop-blur-md bg-white/70 shadow-xl rounded-2xl border-border/50">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-background rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold">AN</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Ada N.</p>
                  <p className="text-sm text-foreground">So excited to announce I'm getting married in August! 💍 #LagosWedding</p>
                </div>
              </div>
              <MessageSquare className="w-6 h-6 text-primary mx-auto" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center space-y-4">
              <div className="bg-primary/10 p-6 rounded-full inline-block">
                <Brain className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm">❌ No "Tailor" keyword</div>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm ml-2">✅ Event: Wedding</div>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">✅ Location: Lagos</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="space-y-4">
              <Bell className="w-6 h-6 text-primary mx-auto" />
              <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">High Intent Opportunity</span>
                </div>
                <p className="text-sm text-foreground mb-3">Ada is getting married. Implied Need: Bespoke Tailoring / Event Planning.</p>
                <Button size="sm" className="w-full">
                  Draft Pitch
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalConfigSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-16">
          Precision Filtering for the <span className="text-primary">African Market</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Boolean Logic (AND/OR/NOT)</h3>
                <p className="text-muted-foreground">Combine keywords for precision targeting</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Location Fencing</h3>
                <p className="text-muted-foreground">Only signals from Lekki Phase 1, Victoria Island, or your target area</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Negative Keywords</h3>
                <p className="text-muted-foreground">Exclude competitors and irrelevant signals</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="p-6 backdrop-blur-md bg-white/70 shadow-xl rounded-2xl border-border/50 transform rotate-2 hover:rotate-0 transition-transform">
              <h3 className="font-semibold text-lg mb-4">Signal Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Rent</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Moving</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">New Apartment</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">Lagos, Nigeria</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Exclude</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm">Competitor A</span>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm">Spam</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LiveSignalFeed() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-16">
          Real-Time <span className="text-primary">Signal Feed</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold">High Intent Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">Prospect asking for vendor recommendations in Lagos.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseCarousel() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">Industry Use Cases</h2>
        <p className="text-muted-foreground mb-8">From real estate to SaaS, URI adapts to your market.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {['Real Estate: Move-in signals and neighborhood trends', 'SaaS: Pain points and competitor mentions', 'E-commerce: Product requests and seasonal demand'].map((item) => (
            <div key={item} className="p-6 bg-card border border-border rounded-2xl">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience the Power of Signal Detection</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Start detecting buying signals with URI. No credit card required for your free trial.</p>
        <Button size="lg" className="rounded-full px-8" asChild>
          <Link href="/pricing">Start Free Trial</Link>
        </Button>
      </div>
    </section>
  );
}
