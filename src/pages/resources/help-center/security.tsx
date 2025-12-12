import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Eye, Key, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

const securityFeatures = [
  { icon: Lock, title: 'Encryption', description: 'All data is encrypted at rest using AES-256 and in transit using TLS 1.3' },
  { icon: Shield, title: 'NDPR Compliant', description: 'Fully compliant with Nigeria Data Protection Regulation requirements' },
  { icon: Eye, title: 'Access Controls', description: 'Role-based access controls ensure users only see what they need' },
  { icon: Key, title: 'SSO Support', description: 'Enterprise plans support SAML-based single sign-on' },
];

const articles = [
  {
    title: 'How We Protect Your Data',
    readTime: '3 min',
    content:
      'URI uses industry-leading security practices including encryption, regular security audits, and secure infrastructure. All data is stored in ISO 27001 certified data centers with redundant backups.',
  },
  {
    title: 'NDPR and GDPR Compliance',
    readTime: '4 min',
    content:
      "URI is fully compliant with NDPR (Nigeria Data Protection Regulation) and GDPR. We've registered with NITDA and maintain comprehensive data protection policies. You can request a copy of our Data Processing Agreement at any time.",
  },
  {
    title: 'Your Privacy Rights',
    readTime: '3 min',
    content: 'You have the right to access, correct, delete, or export your data. Submit requests via Settings > Privacy or email privacy@uri.africa. We respond to all requests within 30 days.',
  },
  {
    title: 'Enabling Two-Factor Authentication',
    readTime: '2 min',
    content: 'Go to Settings > Security > Two-Factor Authentication. You can use an authenticator app (recommended) or SMS. 2FA adds an extra layer of security to your account.',
  },
  {
    title: 'Managing API Keys',
    readTime: '2 min',
    content: 'API keys are available on Professional and Enterprise plans. Go to Settings > API to generate keys. Never share your API keys publicly. Rotate keys regularly for security.',
  },
  {
    title: 'Reporting Security Issues',
    readTime: '2 min',
    content:
      'If you discover a security vulnerability, please report it to security@uri.africa. We take all reports seriously and will respond within 24 hours. We offer a bug bounty program for valid reports.',
  },
  {
    title: 'Data Retention Policy',
    readTime: '2 min',
    content:
      'Signal data is retained for 12 months by default. You can request earlier deletion. Billing records are retained for 7 years as required by Nigerian law. Account data is deleted 90 days after account closure.',
  },
  {
    title: 'Third-Party Integrations Security',
    readTime: '3 min',
    content: 'All third-party integrations use OAuth 2.0 for authentication. We never store your CRM passwords. You can revoke integration access at any time from Settings > Integrations.',
  },
  {
    title: 'Employee Access Controls',
    readTime: '2 min',
    content: 'URI employees have limited access to customer data. All access is logged and audited. Support staff can only access your data with your explicit permission during troubleshooting.',
  },
];

export default function SecurityHelpPage() {
  return (
    <>
      <SeoHead title="Help Center – Security & Privacy" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/help-center" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">9 Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Security & <span className="text-primary">Privacy</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Learn how we protect your data and maintain compliance with data protection regulations.</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/legal/security">Security Overview</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/legal/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid md:grid-cols-2 gap-6 mb-12">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-xl p-6">
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
            <h2 className="text-2xl font-bold">Security Articles</h2>
            {articles.map((article) => (
              <div key={article.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" /> {article.readTime}
                  </span>
                </div>
                <p className="text-muted-foreground">{article.content}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 grid md:grid-cols-2 gap-6">
            <Link href="/pricing" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Previous: Billing & Plans</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage your subscription and payments.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
            <Link href="/resources/help-center/api" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Next: API & Technical</h3>
              <p className="text-sm text-muted-foreground mb-4">Technical documentation for developers.</p>
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
