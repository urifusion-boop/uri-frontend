import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Play } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: 'Creating Your URI Account',
    readTime: '2 min',
    content: [
      "Visit uri.africa and click 'Start Free Trial'",
      'Enter your email address and create a password',
      'Verify your email through the confirmation link',
      'Complete your profile with company information',
      "You're ready to start detecting buying signals!",
    ],
  },
  {
    title: 'Setting Up Your First Search',
    readTime: '3 min',
    content: [
      "Navigate to the Dashboard and click 'New Search'",
      'Define your target audience (industry, location, company size)',
      'Add keywords related to your product or service',
      'Set up negative keywords to filter irrelevant results',
      'Choose your signal types (purchase intent, pain points, etc.)',
      'Save and activate your search',
    ],
  },
  {
    title: 'Understanding Your Dashboard',
    readTime: '4 min',
    content: [
      'Signal Feed: Real-time stream of detected buying signals',
      'Lead Queue: Prioritized list of prospects ready for outreach',
      'Analytics: Performance metrics and conversion tracking',
      'Settings: Configure alerts, integrations, and preferences',
      'Reports: Generate custom reports for your team',
    ],
  },
  {
    title: 'Configuring Alert Notifications',
    readTime: '2 min',
    content: [
      'Go to Settings > Notifications',
      'Choose your preferred channels (Email, Slack, SMS)',
      'Set up priority levels for different signal types',
      'Configure quiet hours if needed',
      'Test your notification settings',
    ],
  },
  {
    title: 'Inviting Team Members',
    readTime: '2 min',
    content: [
      'Navigate to Settings > Team',
      "Click 'Invite Member' and enter email addresses",
      'Assign roles (Admin, Manager, Member)',
      'Team members receive invitation emails',
      'Manage permissions and access levels as needed',
    ],
  },
  {
    title: 'Your First Week Checklist',
    readTime: '5 min',
    content: [
      'Day 1: Complete account setup and profile',
      'Day 2: Connect your CRM for lead sync',
      'Day 3: Set up your first 3 searches',
      'Day 4: Review initial signals and take action on 5',
      'Day 5: Invite 2 team members',
      'Day 6: Set up Slack integration for alerts',
      'Day 7: Review analytics and optimize searches',
    ],
  },
];

export default function GettingStartedHelpPage() {
  return (
    <>
      <SeoHead title="Help Center – Getting Started" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/help-center" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">12 Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Getting <span className="text-primary">Started</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Everything you need to know to get up and running with URI in minutes.</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="rounded-full">
                <Play className="w-4 h-4 mr-2" /> Watch Video Tutorial
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/company/contact">Get Personal Onboarding</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
            {articles.map((article) => (
              <div key={article.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" /> {article.readTime}
                  </span>
                </div>
                <ol className="space-y-2">
                  {article.content.map((step, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-12 grid md:grid-cols-2 gap-6">
            <Link href="/resources/help-center/crm-integration" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Next: CRM Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">Learn how to connect your CRM for seamless lead sync.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
            <Link href="/resources/help-center/signal-detection" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Next: Signal Detection</h3>
              <p className="text-sm text-muted-foreground mb-4">Master the art of detecting and acting on buying signals.</p>
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
