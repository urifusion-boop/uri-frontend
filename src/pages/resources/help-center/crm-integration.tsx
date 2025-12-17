import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: 'Connecting Salesforce',
    readTime: '3 min',
    steps: [
      'Go to Settings > Integrations in URI',
      "Click 'Connect Salesforce'",
      'Log in with your Salesforce admin credentials',
      'Grant URI the required permissions',
      'Select objects to sync (Leads, Contacts, Accounts)',
      'Configure field mappings',
      'Test the connection',
    ],
    troubleshooting: 'If connection fails, ensure you have admin privileges in Salesforce and that API access is enabled for your org.',
  },
  {
    title: 'Connecting HubSpot',
    readTime: '3 min',
    steps: [
      'Navigate to Settings > Integrations',
      "Select 'Connect HubSpot'",
      'Authenticate with your HubSpot credentials',
      'Choose your HubSpot portal',
      'Select contact properties to sync',
      'Map URI fields to HubSpot properties',
      'Enable the integration',
    ],
    troubleshooting: "Make sure you're using a HubSpot account with super admin access. Marketing Hub Professional or higher is recommended.",
  },
  {
    title: 'Connecting Pipedrive',
    readTime: '3 min',
    steps: [
      'Access Settings > Integrations in URI',
      "Click 'Connect Pipedrive'",
      'Enter your Pipedrive API token (found in Settings > Personal > API)',
      'Select your pipeline and stages',
      'Configure person and deal syncing',
      'Set up activity creation preferences',
      'Activate the integration',
    ],
    troubleshooting: 'Your API token must have full access permissions. Regenerate the token if you encounter authorization errors.',
  },
  {
    title: 'Field Mapping Best Practices',
    readTime: '4 min',
    steps: [
      'Create custom fields in your CRM for URI data before connecting',
      "Map 'Signal Type' to a custom picklist field",
      "Map 'Signal Score' to a number field",
      "Map 'Signal Source' to a text field",
      "Map 'Signal Date' to a datetime field",
      'Test with a few records before enabling full sync',
      'Document your mappings for team reference',
    ],
    troubleshooting: 'Field type mismatches are the most common sync issues. Ensure text fields map to text, numbers to numbers, etc.',
  },
  {
    title: 'Bi-directional Sync Setup',
    readTime: '3 min',
    steps: [
      'Enable bi-directional sync in integration settings',
      'Choose which fields to sync back to URI',
      'Set up conflict resolution rules (CRM wins vs. URI wins)',
      'Configure sync frequency (real-time recommended)',
      'Enable activity logging from CRM to URI',
      'Test with a sample record',
      'Monitor sync logs for the first week',
    ],
    troubleshooting: 'If records are duplicating, check your unique identifier settings. Email is usually the best deduplication key.',
  },
  {
    title: 'Troubleshooting Sync Errors',
    readTime: '5 min',
    steps: [
      'Check the Sync Status dashboard for error details',
      'Common errors: API rate limits, field validation, permissions',
      'For rate limit errors, reduce sync frequency temporarily',
      'For validation errors, check required fields in your CRM',
      'For permission errors, re-authenticate with admin credentials',
      'Contact support if errors persist after troubleshooting',
      'Review sync logs weekly to catch issues early',
    ],
    troubleshooting: 'Most sync errors are resolved by re-authenticating. Try disconnecting and reconnecting the integration.',
  },
];

export default function CRMIntegrationHelpPage() {
  return (
    <>
      <SeoHead title="Help Center – CRM Integration" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/help-center" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">8 Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              CRM <span className="text-primary">Integration</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Connect URI with your CRM to automatically sync leads and signals.</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/integrations">View All Integrations</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/resources/guides">Download Full Guide</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
            {articles.map((article) => (
              <div key={article.title} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" /> {article.readTime}
                  </span>
                </div>
                <ol className="space-y-2 mb-4">
                  {article.steps.map((step, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Troubleshooting Tip</span>
                    <p className="text-sm text-muted-foreground">{article.troubleshooting}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-12 grid md:grid-cols-2 gap-6">
            <Link href="/resources/help-center/getting-started" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Previous: Getting Started</h3>
              <p className="text-sm text-muted-foreground mb-4">New to URI? Start with the basics.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
            <Link href="/resources/help-center/signal-detection" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Next: Signal Detection</h3>
              <p className="text-sm text-muted-foreground mb-4">Learn how to detect and act on buying signals.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
