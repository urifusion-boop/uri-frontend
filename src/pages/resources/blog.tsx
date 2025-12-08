import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    title: 'How Intent Data is Revolutionizing B2B Sales in Africa',
    excerpt: 'Discover how African businesses are using buying signals to find ready customers faster than ever before.',
    category: 'Sales Strategy',
    date: 'Dec 2, 2024',
    readTime: '5 min read',
  },
  {
    title: 'The Complete Guide to Lead Scoring with Buying Signals',
    excerpt: 'Learn how to prioritize leads based on their intent signals and close more deals with less effort.',
    category: 'Product Updates',
    date: 'Nov 28, 2024',
    readTime: '8 min read',
  },
  {
    title: "Why Your Cold Outreach Isn't Working (And What to Do Instead)",
    excerpt: "Cold emails have a 1% response rate. Here's how signal-based selling achieves 10x better results.",
    category: 'Sales Strategy',
    date: 'Nov 20, 2024',
    readTime: '6 min read',
  },
  {
    title: 'NDPR Compliance: What Nigerian Businesses Need to Know',
    excerpt: 'A practical guide to Nigeria Data Protection Regulation and how it affects your sales processes.',
    category: 'Compliance',
    date: 'Nov 15, 2024',
    readTime: '7 min read',
  },
  {
    title: 'Case Study: How Sendsafe Increased Conversions by 300%',
    excerpt: "A Lagos-based logistics company transformed their B2B sales with URI's intent signals.",
    category: 'Case Studies',
    date: 'Nov 10, 2024',
    readTime: '6 min read',
  },
];

export default function ResourcesBlogPage() {
  return (
    <>
      <SeoHead title="Blog" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Blog</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Insights and Updates</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Articles to help African sales teams master intent-based selling.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.article key={post.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-card border border-border rounded-2xl p-6">
                <span className="inline-block mb-3 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                <Button variant="ghost" className="text-primary hover:text-primary/80 mt-4 p-0" asChild>
                  <Link href="/company/contact">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
