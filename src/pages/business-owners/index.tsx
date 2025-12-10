import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Target, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  { icon: TrendingUp, title: 'Drive Growth with Insights', description: 'Get real-time buying signals that help you identify and capture new opportunities before your competitors.' },
  { icon: Target, title: 'Find Your Ideal Customers', description: 'AI-powered signal detection identifies prospects who match your ideal customer profile and are actively looking.' },
  { icon: Users, title: 'Build Stronger Relationships', description: 'Understand customer needs at the right moment to deliver personalized outreach that resonates.' },
  { icon: BarChart3, title: 'Measure What Matters', description: 'Track ROI on every lead and campaign with clear analytics that inform better business decisions.' },
];

const features = [
  'Real-time intent signals from across the web',
  'Automated lead scoring and prioritization',
  'CRM integration for seamless workflows',
  'Custom alerts for high-value opportunities',
  'ROI tracking and performance analytics',
];

export default function BusinessOwnersPage() {
  return (
    <>
      <SeoHead title="For Business Owners" />
      <Navigation />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">For Business Owners</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Drive Growth with <span className="text-primary">Real-Time Insights</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Stop guessing and start knowing. URI helps you identify customers who are ready to buy, so you can focus on what matters most—growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </div>
            </motion.div>
          </div>

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
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Everything You Need to Succeed</h2>
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
