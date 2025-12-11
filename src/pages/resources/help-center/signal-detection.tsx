import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Target } from 'lucide-react';
import Link from 'next/link';

const signalTypes = [
  {
    name: 'Purchase Intent',
    description: 'Direct expressions of intent to buy a product or service',
    examples: ['Looking for recommendations for...', 'Anyone know a good...', 'Need to find a vendor for...'],
    score: 'High (80-100)',
  },
  {
    name: 'Pain Point Expression',
    description: 'Complaints or frustrations that your solution addresses',
    examples: ['Struggling with...', 'So frustrated by...', 'Why is it so hard to...'],
    score: 'High (70-90)',
  },
  {
    name: 'Life/Business Events',
    description: 'Changes that often trigger purchasing decisions',
    examples: ['Just got promoted to...', "We're expanding to...", 'Announcing our new...'],
    score: 'Medium (50-75)',
  },
  {
    name: 'Competitor Mentions',
    description: 'Discussions about competing products or services',
    examples: ['Thinking of switching from...', 'Anyone used X alternative?', 'Comparing X vs Y...'],
    score: 'Medium (60-80)',
  },
  {
    name: 'Research Signals',
    description: 'Early-stage research and information gathering',
    examples: ["What's the best...", 'How do you handle...', 'Tips for choosing...'],
    score: 'Low-Medium (40-60)',
  },
];

const articles = [
  {
    title: 'Understanding Signal Scores',
    readTime: '3 min',
    content:
      'Signal scores range from 0-100 and indicate the likelihood of purchase intent. Scores above 70 are considered high-intent and should be prioritized. Scores are calculated based on language analysis, context, timing, and historical conversion data.',
  },
  {
    title: 'Creating Custom Signal Rules',
    readTime: '4 min',
    content:
      'Go to Settings > Signal Rules to create custom detection criteria. You can combine keywords, exclude terms, filter by location, industry, and company size. Custom rules help you focus on the most relevant signals for your business.',
  },
  {
    title: 'Filtering and Sorting Signals',
    readTime: '2 min',
    content:
      'Use the filter panel to narrow signals by type, score, date, location, or source. Sort by score (highest first) to prioritize hot leads. Save filter combinations as presets for quick access.',
  },
  {
    title: 'Setting Up Smart Alerts',
    readTime: '3 min',
    content:
      "Configure alerts in Settings > Notifications. Create rules like 'Alert me when a signal score exceeds 80' or 'Notify on any signal from my target companies.' Choose delivery via email, Slack, or SMS.",
  },
  {
    title: 'Acting on Signals Quickly',
    readTime: '3 min',
    content: 'Speed matters with buying signals. The average response time for closed deals is under 2 hours. Use the Quick Action feature to send templated responses directly from the signal feed.',
  },
];

export default function SignalDetectionHelpPage() {
  return (
    <>
      <SeoHead title="Help Center – Signal Detection" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/help-center" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">15 Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Signal <span className="text-primary">Detection</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Learn how URI detects buying signals and how to optimize your searches for maximum relevance and conversion.</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/signal-detection">See Signal Detection in Action</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Signal Types Explained</h2>
            <div className="space-y-4">
              {signalTypes.map((signal) => (
                <div key={signal.name} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Target className="w-5 h-5 text-primary mr-2" /> {signal.name}
                    </h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Score: {signal.score}</span>
                  </div>
                  <p className="text-muted-foreground mb-3">{signal.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {signal.examples.map((example, i) => (
                      <span key={i} className="px-3 py-1 bg-muted text-sm rounded-lg">
                        "{example}"
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
            <h2 className="text-2xl font-bold">How-To Articles</h2>
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
            <Link href="/resources/help-center/crm-integration" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Previous: CRM Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect your CRM for seamless syncing.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
            <Link href="/resources/help-center/billing" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Next: Billing & Plans</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage your subscription and billing.</p>
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
