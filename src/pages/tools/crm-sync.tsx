import hubspotLogo from '@/assets/logos/hubspot.svg';
import pipedriveLogo from '@/assets/logos/pipedrive.svg';
import salesforceLogo from '@/assets/logos/salesforce.svg';
import slackLogo from '@/assets/logos/slack.svg';
import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Check, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: ArrowLeftRight,
    title: 'Bidirectional Sync',
    description: 'Changes in URI automatically reflect in your CRM, and vice versa. No manual data entry required.',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Signals and lead data sync instantly. Your sales team always has the latest information.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade encryption with NDPR and GDPR compliance. Your data stays protected.',
  },
];

const syncCapabilities = [
  'Contact & company data',
  'Lead scoring & intent signals',
  'Activity history & touchpoints',
  'Custom field mapping',
  'Deal & opportunity sync',
  'Task & reminder creation',
  'Email engagement tracking',
  'Pipeline stage updates',
];

export default function CrmSyncPage() {
  return (
    <>
      <SeoHead title="CRM Sync" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">CRM Sync</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Keep Your CRM
              <span className="text-primary"> In Sync</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Connect URI to your CRM so buying signals and lead data flow directly into your pipeline.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { name: 'Salesforce', logo: salesforceLogo },
              { name: 'HubSpot', logo: hubspotLogo },
              { name: 'Pipedrive', logo: pipedriveLogo },
              { name: 'Slack', logo: slackLogo },
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-border flex items-center justify-center p-3">
                    {(() => {
                      const Logo = integration.logo as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                      return <Logo className="w-full h-full" aria-label={integration.name} />;
                    })()}
                  </div>
                  <h3 className="text-xl font-semibold">{integration.name}</h3>
                </div>
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li key={feature.title} className="flex items-center gap-2 text-sm">
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Sync Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {syncCapabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Revive Your Dead Leads</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Connect your CRM and let URI monitor your closed-lost leads. We'll alert you when they show new buying signals.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/company/contact">Connect Your CRM</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/integrations">View All Integrations</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
