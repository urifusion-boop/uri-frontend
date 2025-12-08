import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Briefcase, Building, Calendar, MapPin, MessageSquare, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const signalTypes = [
  {
    icon: ShoppingCart,
    title: 'Purchase Intent',
    description: 'Detect when prospects are actively searching for products or services like yours.',
    example: '"Looking for reliable solar installers in Abuja"',
  },
  {
    icon: Briefcase,
    title: 'Job Changes',
    description: 'Track when key decision-makers change roles or companies – prime time for new vendor relationships.',
    example: '"Excited to announce I\'m joining FinTech Co as CTO!"',
  },
  {
    icon: Building,
    title: 'Company Events',
    description: 'Monitor funding announcements, expansions, and new office openings.',
    example: '"We just closed our Series A! Time to scale our team."',
  },
  {
    icon: MessageSquare,
    title: 'Pain Point Expression',
    description: 'Identify prospects complaining about problems your solution solves.',
    example: '"Our current payroll software is so frustrating..."',
  },
  {
    icon: Calendar,
    title: 'Life Events',
    description: 'Capture personal milestones that indicate purchasing opportunities.',
    example: '"Getting married in August! #LagosWedding"',
  },
  {
    icon: TrendingUp,
    title: 'Growth Signals',
    description: 'Spot companies hiring rapidly or expanding into new markets.',
    example: '"We\'re hiring 50 new engineers this quarter!"',
  },
  {
    icon: MapPin,
    title: 'Location-Based',
    description: 'Filter signals by specific African cities and regions.',
    example: '"Opening our new office in Lekki Phase 1"',
  },
  {
    icon: Users,
    title: 'Recommendations Sought',
    description: 'Find prospects actively asking for vendor recommendations.',
    example: '"Can anyone recommend a good CRM for startups?"',
  },
];

export default function SignalsPage() {
  return (
    <>
      <SeoHead title="Signals" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Signal Detection</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Understand the Signals That <span className="text-primary">Drive Sales</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              URI\'s AI analyzes millions of social posts, forums, and web content to identify buying signals specific to the African market. Here\'s what we detect.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {signalTypes.map((signal, index) => (
              <motion.div
                key={signal.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <signal.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{signal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{signal.description}</p>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm italic text-muted-foreground">{signal.example}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">See Signal Detection in Action</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Watch how URI transforms a simple social post into an actionable sales opportunity.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/signal-detection">View Live Demo</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
