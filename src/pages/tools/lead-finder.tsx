import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, Filter, MapPin, Search, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { icon: Filter, title: 'Set Your Criteria', description: 'Define your ideal customer profile: industry, location, company size, and buying signals you want to track.' },
  { icon: Search, title: 'AI Scans the Web', description: 'URI continuously monitors social media, forums, and websites across Africa for matching prospects.' },
  { icon: Users, title: 'Get Qualified Leads', description: 'Receive a curated list of prospects who match your criteria and have shown recent buying intent.' },
  { icon: Download, title: 'Export & Engage', description: 'Export leads to your CRM or engage directly with personalized outreach based on their signals.' },
];

const useCases = [
  'Find CTOs in Lagos complaining about cloud server costs',
  'Locate startups in Nairobi that just announced funding',
  'Discover HR managers asking for payroll software recommendations',
  'Track people in Abuja searching for reliable solar installers',
];

export default function LeadFinderPage() {
  return (
    <>
      <SeoHead title="Lead Finder" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Lead Finder Tool</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Prospects Ready to <span className="text-primary">Buy Now</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop cold outreach. URI's Lead Finder identifies prospects who are actively searching for solutions like yours across the African market.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs text-primary font-medium mb-2">Step {index + 1}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-16">
            <div className="flex items-center gap-2 justify-center mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">African Market Coverage</h2>
            </div>
            <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">URI provides deep coverage of key African markets where global tools fall short. Find high-intent leads in:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Lagos', 'Nairobi', 'Accra', 'Johannesburg', 'Cairo', 'Abuja', 'Kigali', 'Dar es Salaam'].map((city) => (
                <span key={city} className="px-4 py-2 bg-background border border-border rounded-full text-sm font-medium">
                  {city}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-card border border-border rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-2 justify-center mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Example Searches</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-muted/50 rounded-xl p-4 text-sm italic text-muted-foreground">
                  "{useCase}"
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/company/contact">Try Lead Finder Free</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
