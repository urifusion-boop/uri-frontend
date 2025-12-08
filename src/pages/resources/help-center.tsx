import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Book, Mail, MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: 'How do I connect my CRM to URI?',
    answer:
      'Navigate to Settings > Integrations, select your CRM (Salesforce, HubSpot, or Pipedrive), and follow the OAuth authentication flow. Once connected, URI will automatically sync your contacts and begin monitoring for buying signals.',
  },
  {
    question: 'What types of buying signals does URI detect?',
    answer:
      'URI detects various signal types including purchase intent, job changes, company events, pain point expressions, life events, growth signals, location-based signals, and recommendation requests. Each signal is scored based on relevance and urgency.',
  },
  {
    question: "How accurate is URI's signal detection?",
    answer: "URI's AI achieves 85%+ accuracy on signal classification. We continuously train our models on African market data to improve relevance for local businesses.",
  },
  {
    question: 'Can I customize which signals trigger alerts?',
    answer:
      'Yes! In the Alert Settings, you can configure custom rules based on signal type, industry, location, company size, and more. You can also set different notification channels for different signal priorities.',
  },
  {
    question: 'Is my data secure and NDPR compliant?',
    answer: 'Absolutely. URI is fully compliant with Nigeria Data Protection Regulation (NDPR) and GDPR. We use enterprise-grade encryption, and you can request data deletion at any time.',
  },
  {
    question: 'How do I export leads from URI?',
    answer: 'You can export leads as CSV from the Leads dashboard, or use our CRM sync to automatically push leads to your connected CRM. API access is available on Enterprise plans.',
  },
];

const categories = [
  { name: 'Getting Started', count: 12 },
  { name: 'CRM Integration', count: 8 },
  { name: 'Signal Detection', count: 15 },
  { name: 'Billing & Plans', count: 6 },
  { name: 'Security & Privacy', count: 9 },
  { name: 'API & Technical', count: 11 },
];

export default function HelpCenterPage() {
  return (
    <>
      <SeoHead title="Help Center" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="text-primary font-medium mb-4 block">Help Center</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How Can We <span className="text-primary">Help?</span>
            </h1>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search for answers..." className="pl-12 h-14 rounded-full text-lg" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {categories.map((category) => (
              <button key={category.name} className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all duration-300">
                <Book className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count} articles</p>
              </button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Chat with our support team in real-time. Available Mon-Fri, 9am-6pm WAT.</p>
                <Button variant="outline" className="rounded-full">
                  Start Chat
                </Button>
              </div>
              <div className="text-center">
                <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/company/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
