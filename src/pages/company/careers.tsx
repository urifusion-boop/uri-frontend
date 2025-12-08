import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Award, Laptop, MapPin, Rocket, Users } from 'lucide-react';
import Link from 'next/link';

const openings = [
  { title: 'Senior Frontend Engineer', location: 'Remote - Africa', type: 'Full-time' },
  { title: 'Product Designer', location: 'Remote - Africa', type: 'Full-time' },
  { title: 'Growth Marketer', location: 'Remote - Africa', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <>
      <SeoHead title="Careers" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Careers</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the <span className="text-primary">URI Team</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Help us build the future of signal-driven selling for African businesses.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, title: 'Small, Senior Team', description: 'Work with experienced teammates who ship fast.' },
              { icon: Laptop, title: 'Remote First', description: 'Flexible remote work across Africa.' },
              { icon: Rocket, title: 'Real Impact', description: 'Ship features used by revenue teams daily.' },
            ].map((b) => (
              <div key={b.title} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-6">Open Roles</h2>
            <div className="space-y-4">
              {openings.map((role) => (
                <div key={role.title} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-border rounded-xl">
                  <div>
                    <h3 className="font-semibold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {role.location} • {role.type}
                    </p>
                  </div>
                  <Button className="rounded-full" variant="outline" asChild>
                    <Link href="/company/contact">Apply</Link>
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center"
          >
            <Award className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Don’t See Your Role?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">We’re always excited to meet great people. Tell us how you can help us grow.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/company/contact">Pitch Us</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
