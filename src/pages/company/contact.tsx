import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, title: 'Office', details: ['14 Admiralty Way', 'Lekki Phase 1', 'Lagos, Nigeria'] },
  { icon: Mail, title: 'Email', details: ['hello@uri.africa', 'support@uri.africa'] },
  { icon: Phone, title: 'Phone', details: ['+234 810 123 4567', '+234 812 987 6543'] },
  { icon: Clock, title: 'Hours', details: ['Monday - Friday', '9:00 AM - 6:00 PM WAT'] },
];

export default function ContactPage() {
  return (
    <>
      <SeoHead title="Contact" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Contact Us</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Start a <span className="text-primary">Conversation</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have questions about URI? Want a demo? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Oluwaseun" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Adeyemi" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" type="email" placeholder="seun@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest">What are you interested in?</Label>
                    <select id="interest" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="">Select an option</option>
                      <option value="demo">Product Demo</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="partnership">Partnership</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[120px]" />
                  </div>
                  <Button type="submit" className="w-full rounded-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="bg-card border border-border rounded-xl p-6">
                    <info.icon className="w-6 h-6 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    {info.details.map((detail, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-3">Prefer a Quick Chat?</h3>
                <p className="text-sm text-muted-foreground mb-4">Book a 15-minute call with our team to discuss your needs and see if URI is right for you.</p>
                <Button variant="outline" className="rounded-full">
                  Schedule a Call
                </Button>
              </div>

              <div className="bg-muted/30 rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-3">Enterprise Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-4">For organizations with 50+ sales reps, contact our enterprise team for custom pricing and dedicated support.</p>
                <p className="text-sm font-medium text-primary">enterprise@uri.africa</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
