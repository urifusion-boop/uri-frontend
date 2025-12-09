import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, Bell, Globe, RefreshCw, Search, Shield, Target, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: 'Signal Detection',
    description: 'AI-powered detection of buying signals across social, forums, and the web in real-time.',
    link: '/signals',
  },
  {
    icon: RefreshCw,
    title: 'CRM Integration',
    description: 'Sync with Salesforce, HubSpot, Pipedrive, and more. Revive your closed-lost leads.',
    link: '/integrations',
  },
  {
    icon: Search,
    title: 'Lead Finder',
    description: 'Discover high-intent prospects actively searching for solutions like yours across Africa.',
    link: '/tools/lead-finder',
  },
  {
    icon: BarChart3,
    title: 'ROI Calculator',
    description: 'Measure and predict your return on investment with our intelligent analytics engine.',
    link: '/tools/roi-calculator',
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description: 'Get instant notifications when prospects show buying intent or engagement signals.',
    link: '/signals',
  },
  {
    icon: Globe,
    title: 'African Market Focus',
    description: 'Deep coverage of Lagos, Nairobi, Accra, and other key African business hubs.',
    link: '/company/about',
  },
  {
    icon: Zap,
    title: 'Chrome Extension',
    description: 'Access URI insights directly in your browser while browsing LinkedIn, X, and more.',
    link: '/tools/chrome-extension',
  },
  {
    icon: Shield,
    title: 'NDPR & GDPR Compliant',
    description: 'Enterprise-grade security with full compliance for Nigerian and international data regulations.',
    link: '/legal/ndpr-compliance',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <SeoHead title="Features" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Find <span className="text-primary">Ready Buyers</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              URI combines AI-powered signal detection, CRM integration, and African market intelligence to help you identify prospects at the exact moment they're ready to buy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link href={feature.link}>
                  <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-center mt-16">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
