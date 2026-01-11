import Navigation from '@/components/Navigation';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Download } from 'lucide-react';
import Link from 'next/link';

const subFeatures = [
  {
    icon: BarChart3,
    title: 'Automated Reports',
    description: 'Schedule and generate comprehensive reports automatically. Get weekly digests, monthly summaries, or custom-frequency reports delivered straight to your inbox.',
    benefits: ['Scheduled delivery', 'Custom frequency', 'Team distribution', 'Executive summaries'],
  },
  {
    icon: Download,
    title: 'Lead & Data Export',
    description: 'Export your leads and enriched data in multiple formats. Support for CSV, Excel, JSON, and direct API access for custom integrations.',
    benefits: ['Multiple formats', 'Bulk export', 'API access', 'Custom fields'],
  },
];

const ReportingExports = () => {
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
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Core Feature</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Reporting & <span className="text-primary">Exports</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Generate actionable insights with automated reports and export your data in any format you need.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex justify-center lg:justify-end">
              <img src="/assets/features/reports-hero.png" alt="Reporting and data exports" className="w-full max-w-md lg:max-w-lg object-contain" />
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Better Insights</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Make data-driven decisions with comprehensive reporting and easy-to-export data.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl">
                View Sample Report
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl">
                Start Free Trial
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReportingExports;
