import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Megaphone, TrendingUp, Users, Video } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  { icon: Users, title: 'Engage Audiences', description: 'Discover what your audience is talking about and create content that resonates with their interests.' },
  { icon: TrendingUp, title: 'Track Trending Topics', description: 'Stay ahead of the curve by monitoring emerging trends and conversations in real-time.' },
  { icon: Megaphone, title: 'Amplify Campaigns', description: 'Identify influencers and key voices in your space to maximize campaign reach and impact.' },
  { icon: Video, title: 'Content Intelligence', description: 'Understand what content formats and topics drive the most engagement in your market.' },
];

const features = ['Real-time trend monitoring', 'Audience sentiment analysis', 'Influencer identification', 'Content performance tracking', 'Competitor content analysis', 'Custom topic alerts'];

export default function MediaAndEntertainmentPage() {
  return (
    <>
      <SeoHead title="For Media and Entertainment" />
      <Navigation />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">For Media & Entertainment</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                <span className="text-primary">Engage Audiences</span> Like Never Before
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create content that captivates. URI helps you understand what your audience wants, track trending topics, and amplify your reach with data-driven insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  See Media Use Cases
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Media Intelligence Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-16">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
