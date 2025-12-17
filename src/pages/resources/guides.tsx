import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Download, FileText } from 'lucide-react';
import Link from 'next/link';

const guides = [
  {
    title: 'The Ultimate Guide to Intent-Based Selling',
    description: 'A comprehensive 50-page guide covering everything from signal identification to closing techniques.',
    pages: '50 pages',
    type: 'PDF Guide',
    link: '/resources/guides/intent-based-selling',
  },
  {
    title: 'African B2B Sales Playbook',
    description: 'Strategies and tactics specifically designed for selling to businesses across Africa.',
    pages: '35 pages',
    type: 'PDF Guide',
    link: '/resources/guides/african-b2b-sales',
  },
  {
    title: 'CRM Integration Best Practices',
    description: 'Step-by-step instructions for connecting URI with Salesforce, HubSpot, and Pipedrive.',
    pages: '20 pages',
    type: 'Technical Guide',
    link: '/resources/guides/crm-integration',
  },
  {
    title: 'Lead Scoring Framework Template',
    description: 'A ready-to-use spreadsheet template for scoring leads based on intent signals.',
    pages: 'Excel/Sheets',
    type: 'Template',
    link: '/resources/guides/lead-scoring-template',
  },
  {
    title: 'NDPR Compliance Checklist',
    description: 'Ensure your sales processes comply with Nigeria Data Protection Regulation.',
    pages: '10 pages',
    type: 'Checklist',
    link: '/resources/guides/ndpr-checklist',
  },
  {
    title: 'Signal-to-Sale Conversion Guide',
    description: 'How to turn buying signals into closed deals with personalized outreach strategies.',
    pages: '25 pages',
    type: 'PDF Guide',
    link: '/resources/guides/signal-to-sale',
  },
];

export default function GuidesPage() {
  return (
    <>
      <SeoHead title="Guides" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Resources</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Guides & <span className="text-primary">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Free downloadable resources to help you master intent-based selling and get the most out of URI.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link href={guide.link} className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {guide.type === 'Template' ? <FileText className="w-6 h-6 text-primary" /> : <BookOpen className="w-6 h-6 text-primary" />}
                  </div>
                  <span className="text-xs font-medium text-primary">{guide.type}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-primary transition-colors">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{guide.pages}</span>
                    <span className="text-primary text-sm flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      View Guide
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center mt-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want Custom Training?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Our team can provide personalized onboarding and training for your sales team.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/company/contact">Request Training</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
