import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Award, BookOpen, Check, DollarSign, Handshake } from 'lucide-react';
import Link from 'next/link';

const partnerTypes = [
  {
    icon: Handshake,
    title: 'Referral Partners',
    description: 'Earn commission by referring businesses to URI. Perfect for consultants, agencies, and industry experts.',
    benefits: ['20% recurring commission', 'Partner dashboard', 'Co-marketing support', 'Dedicated partner manager'],
  },
  {
    icon: BookOpen,
    title: 'Implementation Partners',
    description: 'Help customers implement and optimize URI. Ideal for CRM consultants and sales enablement firms.',
    benefits: ['Certification program', 'Implementation fees', 'Priority support access', 'Partner directory listing'],
  },
  {
    icon: Award,
    title: 'Technology Partners',
    description: 'Integrate your product with URI. Great for CRM vendors, sales tools, and data providers.',
    benefits: ['API access', 'Joint product development', 'Co-marketing campaigns', 'Technical support'],
  },
];

export default function PartnersPage() {
  return (
    <>
      <SeoHead title="Partners" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Partner Program</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Together <span className="text-primary">With URI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join our partner ecosystem and help African businesses discover the power of intent-based selling.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <type.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-16">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Partner Earnings</h2>
                </div>
                <p className="text-muted-foreground max-w-lg">Our top partners earn over ₦5M annually through referrals and implementation services. Join them.</p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold text-primary">₦5M+</div>
                <p className="text-sm text-muted-foreground">Top partner earnings</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Partner?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Apply to join our partner program. We'll review your application and get back to you within 48 hours.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/company/contact">Apply Now</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
