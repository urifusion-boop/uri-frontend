import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Rocket, Target, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  { icon: Rocket, title: 'Accelerate Traction', description: 'Find your first 100 customers faster by identifying prospects actively searching for solutions like yours.' },
  { icon: Target, title: 'Validate Product-Market Fit', description: 'Understand real market demand by tracking intent signals and conversations in your target space.' },
  { icon: TrendingUp, title: 'Grow Efficiently', description: 'Focus limited resources on high-intent leads that are most likely to convert, not cold outreach.' },
  { icon: Zap, title: 'Move Fast', description: 'Get set up in minutes and start receiving buying signals immediately—no complex integrations required.' },
];

const features = [
  'Startup-friendly pricing tiers',
  'Quick 5-minute setup process',
  'Real-time intent signal alerts',
  'Integration with popular tools',
  'Scalable as you grow',
  'Dedicated startup support',
];

export default function StartupsPage() {
  return (
    <>
      <SeoHead title="For Startups" />
      <Navigation />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">For Startups</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                <span className="text-primary">Accelerate Traction</span> from Day One
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Every startup needs customers fast. URI helps you find prospects who are already looking for your solution, so you can focus on building, not hunting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  See Startup Plans
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
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Built for Startup Speed</h2>
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
