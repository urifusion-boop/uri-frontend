import Navigation from '@/components/Navigation';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, AtSign, FileText, Hash, Search } from 'lucide-react';
import Link from 'next/link';

const subFeatures = [
  {
    icon: Search,
    title: 'Keyword Tracking',
    description:
      'Monitor specific keywords across all major social platforms. Get real-time alerts when your target keywords are mentioned, helping you identify buying signals and market trends instantly.',
    benefits: ['Real-time monitoring', 'Multi-platform coverage', 'Sentiment analysis', 'Trend detection'],
  },
  {
    icon: Hash,
    title: 'Hashtag Tracking',
    description: 'Track trending and branded hashtags to understand campaign performance and audience engagement. Discover new opportunities through hashtag analytics and competitive monitoring.',
    benefits: ['Campaign tracking', 'Trend identification', 'Competitive analysis', 'Engagement metrics'],
  },
  {
    icon: AtSign,
    title: 'Account Tracking',
    description: 'Follow key accounts, competitors, and industry influencers. Get notified when they post content relevant to your business, enabling timely engagement and competitive intelligence.',
    benefits: ['Competitor monitoring', 'Influencer tracking', 'Content alerts', 'Relationship insights'],
  },
  {
    icon: FileText,
    title: 'Report Generation',
    description: 'Generate comprehensive social media reports with actionable insights. Export data in multiple formats for stakeholder presentations and strategic planning sessions.',
    benefits: ['Custom reports', 'Multiple export formats', 'Visual dashboards', 'Scheduled delivery'],
  },
];

const SocialMediaTracking = () => {
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
                <Hash className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Core Feature</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Social Media <span className="text-primary">Tracking</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Monitor conversations, track trends, and capture buying signals across all major social platforms with AI-powered precision.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
              <img src="/assets/features/social-media-hero.png" alt="Social Media Tracking Dashboard" className="w-full h-auto max-w-lg mx-auto mix-blend-multiply dark:mix-blend-screen" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sub-Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
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

                <div className="grid grid-cols-2 gap-3">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Track Social Signals?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Start monitoring social media conversations and capture high-intent leads before your competitors.</p>
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

export default SocialMediaTracking;
