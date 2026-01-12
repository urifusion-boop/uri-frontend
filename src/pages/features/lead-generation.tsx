import Navigation from '@/components/Navigation';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';

const subFeatures = [
  {
    icon: User,
    title: 'Individual Leads',
    description: 'Identify and capture individual decision-makers showing buying intent. Our AI analyzes online behavior to surface high-quality prospects ready to engage with your solution.',
    benefits: ['Intent scoring', 'Contact enrichment', 'Behavioral analysis', 'Auto-qualification'],
  },
  {
    icon: TrendingUp,
    title: 'Sales Signals',
    description: 'Detect real-time signals indicating purchase readiness. From job changes to funding announcements, capture every trigger that indicates a prospect is ready to buy.',
    benefits: ['Real-time alerts', 'Signal scoring', 'Priority ranking', 'CRM integration'],
  },
  {
    icon: Building2,
    title: 'Organizational Leads',
    description: 'Target entire organizations showing collective buying behavior. Map decision-making units and identify accounts with the highest propensity to convert.',
    benefits: ['Account mapping', 'Org-wide signals', 'Stakeholder identification', 'ABM support'],
  },
];

const LeadGeneration = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="container mx-auto px-6 relative">
          <Link href="/features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card rounded-2xl p-3 inline-flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Core Feature</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Lead <span className="text-primary">Generation</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Capture high-intent leads automatically with AI-powered signal detection and intelligent prospecting.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex justify-center lg:justify-end">
              <img src="/assets/features/lead-generation-hero.png" alt="Lead generation funnel visualization" className="w-full max-w-md lg:max-w-lg object-contain" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sub-Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {subFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 glass-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Generate Better Leads?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Start capturing high-intent leads and filling your pipeline with qualified prospects today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl">
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LeadGeneration;
