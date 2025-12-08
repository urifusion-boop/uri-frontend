import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const caseStudies = [
  {
    company: 'Sendsafe Logistics',
    industry: 'Logistics & Delivery',
    location: 'Lagos, Nigeria',
    headline: '300% Increase in Qualified Leads',
    description: "How a Lagos-based logistics company transformed their B2B sales with URI's intent signals.",
    metrics: [
      { label: 'Lead increase', value: '300%' },
      { label: 'Close rate', value: '+45%' },
      { label: 'Sales cycle', value: '-30 days' },
    ],
    featured: true,
  },
  {
    company: 'TechPay Solutions',
    industry: 'FinTech',
    location: 'Nairobi, Kenya',
    headline: 'Doubled Enterprise Pipeline in 90 Days',
    description: 'A fintech startup used URI to identify CFOs actively seeking payment solutions.',
    metrics: [
      { label: 'Pipeline growth', value: '2x' },
      { label: 'Meeting rate', value: '+60%' },
      { label: 'Time to close', value: '-25%' },
    ],
    featured: false,
  },
  {
    company: 'GreenBuild Africa',
    industry: 'Construction',
    location: 'Accra, Ghana',
    headline: '₦50M in New Revenue from Dead Leads',
    description: "How URI's CRM sync revived closed-lost opportunities with new buying signals.",
    metrics: [
      { label: 'Revived deals', value: '23' },
      { label: 'New revenue', value: '₦50M' },
      { label: 'ROI', value: '15x' },
    ],
    featured: false,
  },
  {
    company: 'CloudServe Africa',
    industry: 'Cloud Computing',
    location: 'Johannesburg, SA',
    headline: '40% Reduction in Customer Acquisition Cost',
    description: 'Enterprise cloud provider optimized their sales spend with intent-based targeting.',
    metrics: [
      { label: 'CAC reduction', value: '40%' },
      { label: 'Lead quality', value: '+80%' },
      { label: 'Sales efficiency', value: '2.5x' },
    ],
    featured: false,
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <SeoHead title="Case Studies" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Case Studies</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Results from <span className="text-primary">Real Companies</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See how African businesses are using URI to find ready buyers and grow their revenue.</p>
          </motion.div>

          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-card border rounded-2xl overflow-hidden ${study.featured ? 'border-primary' : 'border-border'}`}
              >
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col justify-center">
                    <span className="text-xs font-medium text-primary mb-2">{study.industry}</span>
                    <h3 className="text-2xl font-bold mb-2">{study.company}</h3>
                    <p className="text-sm text-muted-foreground">{study.location}</p>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <h4 className="text-xl font-semibold mb-3">{study.headline}</h4>
                    <p className="text-muted-foreground mb-6">{study.description}</p>
                    <div className="flex flex-wrap gap-6 mb-6">
                      {study.metrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="text-2xl font-bold text-primary">{metric.value}</div>
                          <div className="text-xs text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 p-0" asChild>
                      <Link href="/company/contact">
                        Read Full Case Study <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Be Our Next Success Story?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Join hundreds of African businesses finding ready buyers with URI.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/company/contact">Start Your Free Trial</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
