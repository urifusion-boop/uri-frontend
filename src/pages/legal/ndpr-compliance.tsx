import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bell, Check, FileCheck, Lock, Shield, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

const rights = [
  { icon: FileCheck, title: 'Right to Access', description: 'You can request a copy of all personal data we hold about you at any time.' },
  { icon: Users, title: 'Right to Rectification', description: 'You can ask us to correct any inaccurate or incomplete personal data.' },
  { icon: Trash2, title: 'Right to Erasure', description: "You can request deletion of your personal data when it's no longer needed." },
  { icon: Lock, title: 'Right to Restrict Processing', description: 'You can ask us to limit how we use your data in certain circumstances.' },
  { icon: Bell, title: 'Right to Object', description: 'You can object to processing of your data for marketing or other purposes.' },
  { icon: Shield, title: 'Right to Data Portability', description: 'You can receive your data in a machine-readable format to transfer elsewhere.' },
];

export default function NdprCompliancePage() {
  return (
    <>
      <SeoHead title="NDPR Compliance" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Compliance</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              NDPR <span className="text-primary">Compliance</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              URI is fully compliant with the Nigeria Data Protection Regulation (NDPR). Here's how we protect your rights as a Nigerian data subject.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6">What is NDPR?</h2>
            <p className="text-muted-foreground mb-4">
              The Nigeria Data Protection Regulation (NDPR) is the primary data protection framework in Nigeria, issued by the National Information Technology Development Agency (NITDA) in 2019. It
              regulates how organizations collect, store, process, and share personal data of Nigerian residents.
            </p>
            <p className="text-muted-foreground">
              As a Nigerian technology company, URI is committed to full compliance with NDPR. We have implemented technical and organizational measures to ensure your data is handled lawfully,
              fairly, and transparently.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Your Rights Under NDPR</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rights.map((right) => (
                <div key={right.title} className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <right.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{right.title}</h3>
                  <p className="text-sm text-muted-foreground">{right.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6">Our NDPR Compliance Measures</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Data Protection Officer</h4>
                    <p className="text-sm text-muted-foreground">Dedicated DPO overseeing all data protection activities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Lawful Basis for Processing</h4>
                    <p className="text-sm text-muted-foreground">Clear consent or legitimate interest for all data processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Data Minimization</h4>
                    <p className="text-sm text-muted-foreground">We only collect data necessary for our services</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Privacy by Design</h4>
                    <p className="text-sm text-muted-foreground">Data protection built into our systems from the start</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Breach Notification</h4>
                    <p className="text-sm text-muted-foreground">72-hour notification commitment for data breaches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Annual Audit</h4>
                    <p className="text-sm text-muted-foreground">Regular compliance audits and NITDA filing</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Exercise Your Rights</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              To exercise any of your rights under NDPR, or if you have questions about how we handle your data, contact our Data Protection Officer.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/company/contact">Contact DPO</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/privacy-policy">Read Privacy Policy</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
