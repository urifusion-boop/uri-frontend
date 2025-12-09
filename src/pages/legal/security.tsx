import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Check, Eye, Lock, RefreshCw, Server, Shield, Users } from 'lucide-react';

const securityFeatures = [
  { icon: Lock, title: 'Encryption', description: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your information is protected at every stage.' },
  { icon: Server, title: 'Secure Infrastructure', description: 'Hosted on enterprise-grade cloud infrastructure with SOC 2 Type II certification and 99.9% uptime SLA.' },
  { icon: Eye, title: 'Access Controls', description: 'Role-based access controls, multi-factor authentication, and detailed audit logs for all account activity.' },
  { icon: RefreshCw, title: 'Regular Audits', description: 'Annual penetration testing, vulnerability assessments, and security audits by independent third parties.' },
  { icon: Users, title: 'Employee Security', description: 'All team members undergo background checks and security training. Access is granted on a need-to-know basis.' },
  { icon: Shield, title: 'Incident Response', description: '24/7 security monitoring with a documented incident response plan. Customers notified within 72 hours of any breach.' },
];

const certifications = ['NDPR Compliant', 'GDPR Compliant', 'SOC 2 Type II (Infrastructure)', 'ISO 27001 (In Progress)'];

export default function SecurityPage() {
  return (
    <>
      <SeoHead title="Security" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Security</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Data Security is <span className="text-primary">Our Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">URI is built with enterprise-grade security from the ground up. We protect your data like it's our own.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Compliance & Certifications</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert) => (
                <span key={cert} className="flex items-center gap-2 px-5 py-3 bg-background border border-border rounded-full">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{cert}</span>
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="bg-card border border-border rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Security FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Where is my data stored?</h3>
                <p className="text-sm text-muted-foreground">Data is stored in secure data centers in Europe and Africa, with redundant backups across multiple geographic regions.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I request data deletion?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. You can request complete deletion of your data at any time by contacting privacy@uri.africa. We will process your request within 30 days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do you handle security incidents?</h3>
                <p className="text-sm text-muted-foreground">
                  We have a documented incident response plan. In the event of a breach affecting your data, you will be notified within 72 hours with details and remediation steps.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you share data with third parties?</h3>
                <p className="text-sm text-muted-foreground">
                  We only share data with essential service providers (hosting, payment processing) under strict data processing agreements. We never sell your data.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
