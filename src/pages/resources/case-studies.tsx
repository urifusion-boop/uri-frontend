import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, Globe, GraduationCap, Heart, Sparkles, Target, Truck } from 'lucide-react';
import Link from 'next/link';

const caseStudies = [
  {
    company: 'SendSafe',
    industry: 'Logistics & Delivery',
    location: 'Nigeria',
    icon: Truck,
    useCase: 'B2B Customer Acquisition',
    headline: '~80% Reduction in Prospecting Time',
    description: "How a logistics company transformed their B2B sales pipeline using Uri's intent signals to identify businesses actively discussing delivery challenges.",
    howUriHelped: ['Identified businesses actively discussing delivery challenges', 'Discovered organizational leads in need of logistics solutions', 'Reduced manual prospecting significantly'],
    metrics: [
      { label: 'Prospecting time', value: '~80%', suffix: 'reduction' },
      { label: 'Deal conversations', value: 'Faster', suffix: '' },
      { label: 'Lead quality', value: 'Higher', suffix: '' },
    ],
    featured: true,
  },
  {
    company: 'African Leadership University (ALU)',
    industry: 'Higher Education',
    location: 'Pan-African',
    icon: GraduationCap,
    useCase: 'Student Recruitment & Audience Discovery',
    headline: 'Better-Quality Leads & Faster Outreach',
    description: 'ALU leveraged Uri to track conversations around studying abroad, higher education, and career growth to identify high-intent prospective students.',
    howUriHelped: ['Tracked conversations around studying abroad and higher education', 'Identified high-intent students asking questions online', 'Enabled timely engagement with prospects'],
    metrics: [
      { label: 'Lead quality', value: 'Higher', suffix: '' },
      { label: 'Outreach speed', value: 'Faster', suffix: '' },
      { label: 'Engagement', value: 'Timely', suffix: '' },
    ],
    featured: false,
  },
  {
    company: 'ALX',
    industry: 'EdTech & Training',
    location: 'Pan-African',
    icon: BarChart3,
    useCase: 'Social Media Management & Campaign Monitoring',
    headline: 'Faster Response to Negative Sentiment',
    description: 'ALX used Uri to manage and track social media campaigns, monitor brand mentions, and respond to negative sentiment in real time.',
    howUriHelped: [
      'Managed and tracked social media campaigns',
      'Monitored brand mentions and campaign performance',
      'Tracked negative sentiment in real time',
      'Enabled easier reporting across all platforms',
    ],
    metrics: [
      { label: 'Response time', value: 'Faster', suffix: '' },
      { label: 'Campaign visibility', value: 'Better', suffix: '' },
      { label: 'Brand control', value: 'Enhanced', suffix: '' },
    ],
    featured: false,
  },
  {
    company: 'Datamelon (AI Ignite Program)',
    industry: 'Events & Tech',
    location: 'Nigeria',
    icon: Sparkles,
    useCase: 'Event Attendance & Investor Engagement',
    headline: '~90% Conversion from Identified Opportunities',
    description: 'Datamelon used Uri to identify judges and investors discussing AI, startups, and pitch events, enabling direct contextual engagement.',
    howUriHelped: ['Identified judges and investors discussing AI and startups', 'Enabled direct, contextual engagement using sales signals', 'Targeted outreach for event attendance'],
    metrics: [
      { label: 'Conversion rate', value: '~90%', suffix: '' },
      { label: 'Judge/investor', value: 'Attended', suffix: 'first edition' },
      { label: 'ROI', value: 'Strong', suffix: 'from targeted outreach' },
    ],
    featured: false,
  },
  {
    company: 'Exotic Madam Skincare',
    industry: 'Beauty & Skincare',
    location: 'Nigeria',
    icon: Heart,
    useCase: 'Customer Acquisition & Brand Discovery',
    headline: 'Higher Conversion from Social Conversations',
    description: 'Exotic Madam used Uri to track skincare-related keywords and purchase intent conversations, identifying individuals seeking product recommendations.',
    howUriHelped: ['Tracked skincare-related keywords and purchase intent', 'Identified individuals asking for product recommendations', 'Enabled direct responses to high-intent buyers'],
    metrics: [
      { label: 'Conversion', value: 'Higher', suffix: '' },
      { label: 'Ad dependency', value: 'Reduced', suffix: '' },
      { label: 'Buyer engagement', value: 'Direct', suffix: '' },
    ],
    featured: false,
  },
  {
    company: 'R2Vest',
    industry: 'FinTech & Investment',
    location: 'Ghana/Canada',
    icon: Globe,
    useCase: 'Targeted Diaspora Sourcing',
    headline: 'Better Targeting with Less Effort',
    description: 'R2Vest used Uri to identify location-specific conversations and communities, surfacing high-intent Ghanaians in Canada discussing relocation, finance, and investment.',
    howUriHelped: [
      'Identified location-specific conversations and communities',
      'Surfaced high-intent individuals discussing relocation and investment',
      'Enabled precise targeting without mass outreach',
    ],
    metrics: [
      { label: 'Lead relevance', value: 'Higher', suffix: '' },
      { label: 'Targeting accuracy', value: 'Better', suffix: '' },
      { label: 'Outreach effort', value: 'Less', suffix: '' },
    ],
    featured: false,
  },
  {
    company: 'LSETF (Lagos Innovate Program)',
    industry: 'Government & Innovation',
    location: 'Lagos, Nigeria',
    icon: Target,
    useCase: 'Sentiment Analysis & Content Optimization',
    headline: 'Increased Positive Sentiment & Engagement',
    description: 'LSETF used Uri to analyze audience sentiment across social platforms, identifying high neutral sentiment and shifting to more user-generated content.',
    howUriHelped: ['Analyzed audience sentiment across social platforms', 'Identified high volume of neutral sentiment (low audience connection)', 'Recommended shift to user-generated content'],
    metrics: [
      { label: 'Positive sentiment', value: 'Increased', suffix: '' },
      { label: 'Neutral sentiment', value: 'Reduced', suffix: '' },
      { label: 'Engagement', value: 'Higher', suffix: '' },
    ],
    featured: false,
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <SeoHead title="Case Studies - Uri" description="See how companies like SendSafe, ALU, and ALX use Uri to find leads and grow revenue." />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Case Studies</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Results from
              <span className="text-primary"> Real Companies</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Uri helps organizations across education, logistics, fintech, events, and e-commerce discover high-intent leads, reduce prospecting time, and convert conversations into revenue.
            </p>
          </motion.div>

          {/* Featured Case Study - SendSafe */}
          {caseStudies
            .filter((s) => s.featured)
            .map((study) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary rounded-3xl overflow-hidden mb-12"
              >
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <study.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary">{study.industry}</span>
                      <h3 className="text-2xl font-bold">{study.company}</h3>
                    </div>
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">Featured</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <span className="text-sm text-muted-foreground">Use Case</span>
                      <h4 className="text-xl font-semibold mb-4">{study.useCase}</h4>
                      <p className="text-muted-foreground mb-6">{study.description}</p>

                      <h5 className="font-semibold mb-3">How Uri Helped:</h5>
                      <ul className="space-y-2 mb-6">
                        {study.howUriHelped.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-background/50 rounded-2xl p-6">
                      <h5 className="font-semibold mb-4 text-center">Results</h5>
                      <div className="grid grid-cols-1 gap-4">
                        {study.metrics.map((metric) => (
                          <div key={metric.label} className="text-center p-4 bg-card rounded-xl border border-border">
                            <div className="text-3xl font-bold text-primary">{metric.value}</div>
                            <div className="text-sm text-muted-foreground">{metric.label}</div>
                            {metric.suffix && <div className="text-xs text-muted-foreground/70">{metric.suffix}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Other Case Studies Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies
              .filter((s) => !s.featured)
              .map((study, index) => (
                <motion.div
                  key={study.company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <study.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-primary">{study.industry}</span>
                        <h3 className="font-bold">{study.company}</h3>
                      </div>
                    </div>

                    <span className="text-xs text-muted-foreground">Use Case: {study.useCase}</span>
                    <h4 className="text-lg font-semibold my-2">{study.headline}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{study.description}</p>

                    <div className="space-y-1 mb-4">
                      <span className="text-xs font-medium">How Uri Helped:</span>
                      {study.howUriHelped.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                      {study.metrics.map((metric) => (
                        <div key={metric.label} className="text-center flex-1">
                          <div className="text-lg font-bold text-primary">{metric.value}</div>
                          <div className="text-xs text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Be Our Next Success Story?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Join hundreds of businesses finding ready buyers with Uri.</p>
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
