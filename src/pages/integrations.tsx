import hubspotLogo from '@/assets/logos/hubspot.svg';
import pipedriveLogo from '@/assets/logos/pipedrive.svg';
import salesforceLogo from '@/assets/logos/salesforce.svg';
import slackLogo from '@/assets/logos/slack.svg';
import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const integrations = [
  {
    name: 'Salesforce',
    logo: salesforceLogo,
    description: 'Sync leads, contacts, and opportunities bidirectionally with Salesforce.',
    features: ['Real-time sync', 'Custom field mapping', 'Lead scoring integration', 'Activity logging'],
  },
  {
    name: 'HubSpot',
    logo: hubspotLogo,
    description: 'Connect your HubSpot CRM for seamless lead management and nurturing.',
    features: ['Contact sync', 'Deal tracking', 'Email integration', 'Workflow triggers'],
  },
  {
    name: 'Pipedrive',
    logo: pipedriveLogo,
    description: 'Push high-intent leads directly into your Pipedrive pipeline.',
    features: ['Pipeline sync', 'Activity tracking', 'Smart contact data', 'Deal automation'],
  },
  {
    name: 'Slack',
    logo: slackLogo,
    description: 'Get instant notifications about buying signals in your Slack channels.',
    features: ['Real-time alerts', 'Channel routing', 'Interactive actions', 'Daily digests'],
  },
];

const comingSoon = ['Zoho CRM', 'Monday.com', 'Notion', 'Microsoft Dynamics', 'Freshsales', 'Close.io'];

export default function IntegrationsPage() {
  return (
    <>
      <SeoHead title="Integrations" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Integrations</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect Your Favorite <span className="text-primary">Tools</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              URI integrates seamlessly with the CRMs and tools you already use, so buying signals flow directly into your existing workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
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
                <p className="text-muted-foreground mb-4">{integration.description}</p>
                <ul className="space-y-2">
                  {integration.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {comingSoon.map((tool) => (
                <span key={tool} className="px-4 py-2 bg-background border border-border rounded-full text-sm">
                  {tool}
                </span>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-6">
              Don't see your tool?{' '}
              <Link href="/company/contact" className="text-primary hover:underline">
                Request an integration
              </Link>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="text-center">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/tools/crm-sync">
                Learn About CRM Sync <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
