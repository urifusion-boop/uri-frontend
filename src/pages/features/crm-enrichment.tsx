import Navigation from '@/components/Navigation';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Database, RefreshCw, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const subFeatures = [
  {
    icon: Zap,
    title: 'CRM Integration',
    description: 'Seamlessly integrate with your existing CRM systems including HubSpot, Salesforce, and Pipedrive. Sync data bi-directionally for a unified view of your leads.',
    benefits: ['One-click setup', 'Bi-directional sync', 'Field mapping', 'Real-time updates'],
  },
  {
    icon: AlertCircle,
    title: 'Dead Lead Tracking',
    description: 'Automatically identify and track leads that have gone cold. Our AI monitors for re-engagement signals so you can revive dormant opportunities.',
    benefits: ['Cold lead detection', 'Re-engagement alerts', 'Win-back campaigns', 'Historical analysis'],
  },
  {
    icon: RefreshCw,
    title: 'Continuous Lead Monitoring',
    description: 'Keep your lead data fresh with 24/7 monitoring. Track changes in job titles, company news, and social activity to stay informed.',
    benefits: ['24/7 monitoring', 'Change detection', 'Activity tracking', 'Automated updates'],
  },
  {
    icon: Sparkles,
    title: 'Data Enrichment',
    description: 'Enrich your CRM data with verified contact information, company insights, and social profiles. Turn basic records into comprehensive lead profiles.',
    benefits: ['Contact verification', 'Company data', 'Social profiles', 'Technographics'],
  },
  {
    icon: Database,
    title: 'Reactivation Alerts',
    description: 'Get instant alerts when cold leads show new signs of interest. Re-engage at the perfect moment with contextual insights for your outreach.',
    benefits: ['Instant notifications', 'Context-aware alerts', 'Priority scoring', 'Outreach suggestions'],
  },
];

const CRMEnrichment = () => {
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
                <Database className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Lazarus Technology</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                CRM & Data <span className="text-primary">Enrichment</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Revive dead leads and supercharge your CRM with continuous enrichment, powered by Lazarus AI technology.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex justify-center lg:justify-end">
              <img src="/assets/features/crm-enrichment-hero.png" alt="CRM data enrichment pipeline" className="w-full max-w-md lg:max-w-lg object-contain" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sub-Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enrich Your Data Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Stop letting valuable leads go cold. Keep your CRM healthy and up-to-date with automatic enrichment.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl">
                Connect CRM
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl">
                View Integrations
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CRMEnrichment;
