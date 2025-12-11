import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Target, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const agenciesCartoon = '/assets/images/landing/agencies-cartoon.png';

const benefits = [
  { icon: BarChart3, title: 'Create Data-Led Campaigns', description: "Leverage real-time buying signals to craft campaigns that resonate with your clients' target audiences." },
  { icon: Users, title: 'Scale Client Success', description: 'Deliver measurable results across multiple client accounts with unified signal tracking and reporting.' },
  { icon: Target, title: 'Identify Trending Topics', description: 'Stay ahead of market trends by monitoring conversations and intent signals across industries.' },
  { icon: Zap, title: 'Automate Lead Discovery', description: 'Let AI find high-intent prospects for your clients while you focus on strategy and creative.' },
];

const features = [
  'Multi-client dashboard management',
  'White-label reporting options',
  'Competitive intelligence tracking',
  'Campaign performance analytics',
  'Bulk lead export and CRM sync',
  'Custom alert configurations per client',
];

export default function AgenciesPage() {
  return (
    <>
      <SeoHead title="For Agencies" />
      <Navigation />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">For Agencies</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Create <span className="text-primary">Data-Led Campaigns</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Deliver exceptional results for your clients with real-time intent data. Track trends, discover leads, and prove ROI—all from one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  Book a Demo
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-5xl mx-auto mb-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
              <img src={agenciesCartoon} alt="Agency team collaborating" className="w-full h-auto" />
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Built for Agency Workflows</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-16">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
