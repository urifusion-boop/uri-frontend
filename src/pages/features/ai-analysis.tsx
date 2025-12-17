import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Lightbulb, MessageSquare, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

const capabilities = [
  { icon: Brain, title: 'Semantic Understanding', description: 'Understands meaning behind posts, not just keywords. Recognizes context, sentiment, and implied needs.' },
  { icon: Target, title: 'Intent Classification', description: 'Automatically categorizes signals into purchase intent, pain points, research phase, and more.' },
  { icon: MessageSquare, title: 'Contextual Analysis', description: 'Analyzes full conversation threads to understand what prospects really need.' },
  { icon: Lightbulb, title: 'Implied Need Detection', description: "Detects needs that aren't explicitly stated, e.g., wedding implies venue, catering, photography." },
  { icon: TrendingUp, title: 'Trend Identification', description: 'Identifies emerging topics and trends before they become mainstream opportunities.' },
  { icon: Zap, title: 'Real-time Processing', description: 'Analyzes millions of posts per day with low latency. Never miss time-sensitive opportunities.' },
];

const useCases = [
  {
    input: "So excited to announce I'm getting married in August! #LagosWedding",
    analysis: { event: 'Wedding', location: 'Lagos', timeframe: 'August', impliedNeeds: ['Event venue', 'Catering services', 'Photography', 'Wedding attire', 'Decor', 'Transportation'] },
  },
  {
    input: 'Why is it so hard to find reliable solar installers in Abuja? Third company that ghosted me 😤',
    analysis: { emotion: 'Frustrated', location: 'Abuja', service: 'Solar installation', urgency: 'High', impliedNeeds: ['Reliable contractor', 'Competitive pricing', 'Quick response time'] },
  },
  {
    input: 'Just raised our Series A! Time to scale the team. Looking for great engineers in Nigeria.',
    analysis: { event: 'Funding round', stage: 'Series A', action: 'Hiring', location: 'Nigeria', impliedNeeds: ['Recruiting services', 'HR software', 'Office space', 'Equity management'] },
  },
];

const stats = [
  { value: '85%+', label: 'Classification Accuracy' },
  { value: '50ms', label: 'Average Latency' },
  { value: '12', label: 'Signal Categories' },
  { value: '4M+', label: 'Posts Analyzed Daily' },
];

export default function AIAnalysisPage() {
  return (
    <>
      <SeoHead title="AI Analysis" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Core Feature</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered <span className="text-primary">Signal Analysis</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Our advanced AI understands context, intent, and implied needs to surface the most valuable opportunities.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/signal-detection">See It In Action</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">How Our AI Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <capability.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-4">See AI Analysis in Action</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Watch how our AI transforms social posts into actionable sales intelligence.</p>
            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="bg-card border border-border rounded-2xl p-6 md:p-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs font-medium text-primary mb-2 block">INPUT</span>
                      <div className="bg-muted/50 rounded-xl p-4">
                        <p className="text-lg">"{useCase.input}"</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary mb-2 block">AI ANALYSIS</span>
                      <div className="bg-primary/5 rounded-xl p-4 space-y-3">
                        {Object.entries(useCase.analysis).map(([key, value]) => (
                          <div key={key} className="flex items-start">
                            <span className="text-sm font-medium capitalize w-32 flex-shrink-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="text-sm text-muted-foreground">{Array.isArray(value) ? (value as string[]).join(', ') : (value as string)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-card border border-border rounded-2xl p-8 mb-20">
            <h2 className="text-2xl font-bold mb-6">Built for the African Market</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Trained on millions of African social media posts',
                'Understands local languages and Pidgin English',
                'Recognizes Nigerian, Kenyan, and Ghanaian business contexts',
                'Calibrated for local industries and buying patterns',
                'Continuously learning from new African market data',
                'Optimized for WhatsApp, Twitter, LinkedIn, and local forums',
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience the Power of AI</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Start detecting buying signals with URI's AI-powered analysis. No credit card required for your free trial.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/pricing">Start Free Trial</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
