import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Target, Users } from 'lucide-react';

const values = [
  { icon: Target, title: 'Focus on Outcomes', description: 'We build practical products that help teams close more deals.' },
  { icon: Users, title: 'Sales-First', description: 'Everything we do supports sales teams in Africa and beyond.' },
  { icon: Sparkles, title: 'Simplicity Wins', description: 'No complexity for complexity’s sake. Clear, fast, and useful.' },
];

export default function AboutPage() {
  return (
    <>
      <SeoHead title="About" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">About Us</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="text-primary">Revenue Teams</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">URI helps sales teams find and act on buying signals faster than anyone else.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                We believe African businesses deserve go-to-market tools built for their realities. URI delivers signal-driven prospecting so teams can spend more time selling and less time guessing.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" /> Lagos, Nigeria
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-4">What We Deliver</h3>
              <ul className="space-y-3 text-sm">
                <li>Buying signal detection across social and web</li>
                <li>Lead scoring that prioritizes who’s ready to talk</li>
                <li>Seamless CRM sync and data hygiene</li>
                <li>Tools that fit seamlessly into sales workflows</li>
              </ul>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid md:grid-cols-3 gap-6 mb-16">
            {values.map((v, i) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
