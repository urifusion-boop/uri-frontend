import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Lightbulb, Target, Users } from 'lucide-react';
import Link from 'next/link';

const productTeamsCartoon = '/assets/images/landing/product-teams-cartoon.png';
const benefits = [
  { icon: Lightbulb, title: 'Inform Product Decisions', description: 'Understand what features customers are asking for by monitoring real conversations and intent signals.' },
  { icon: Users, title: 'Understand User Needs', description: "Get direct insight into pain points and desired solutions from your target market's actual discussions." },
  { icon: BarChart3, title: 'Track Competitive Landscape', description: 'Monitor how users talk about competitors and identify opportunities for differentiation.' },
  { icon: Target, title: 'Validate Before Building', description: 'Test demand for new features by tracking intent signals before investing development resources.' },
];

const features = ['Feature request tracking', 'Competitive intelligence dashboard', 'User sentiment analysis', 'Market trend monitoring', 'Integration with product tools', 'Custom keyword tracking'];

export default function ProductTeamsPage() {
  return (
    <>
      <SeoHead title="For Product Teams" />
      <Navigation />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">For Product Teams</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                <span className="text-primary">Inform Product Decisions</span> with Real Data
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build what users actually want. URI gives you direct insight into customer needs, competitive gaps, and market trends—all in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  See Product Use Cases
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-5xl mx-auto mb-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
              <img src={productTeamsCartoon} alt="Product team reviewing user feedback and trends" className="w-full h-auto" />
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
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Product Intelligence Features</h2>
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
