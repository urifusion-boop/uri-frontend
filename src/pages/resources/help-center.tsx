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
    question: 'What is URI?',
    answer: 'URI is an AI-powered platform that detects buying intent, finds verified decision-makers, and generates sales opportunities automatically.',
  },
  {
    question: 'How does URI find leads?',
    answer: 'URI scans the internet — LinkedIn, X, Facebook, news platforms, forums, and company pages — to detect sales signals and high-intent triggers.',
  },
  {
    question: 'What kind of signals does URI track?',
    answer: [
      'Direct requests and need',
      'Complaints & service frustrations',
      'Product launches',
      'Expansion or relocation updates',
      'Hashtag mentions',
      'Keyword mentions',
      'Company activities & market trends',
    ],
  },
  {
    question: 'Who is URI built for?',
    answer: 'Business owners, sales teams, marketers, founders, agencies, and anyone who needs a steady flow of verified leads and real-time market insights.',
  },
  {
    question: 'Does URI provide verified contact details?',
    answer: 'Yes — URI enriches leads with email, phone number, social links, role, company info, and more (based on availability).',
  },
  {
    question: 'How fast are the alerts?',
    answer: 'Instant. URI notifies you the moment a buying signal is detected.',
  },
  {
    question: 'Can I customize my trackers?',
    answer: 'Yes — you can customize keywords, hashtags, industries, decision-maker roles, and company types you want to track.',
  },
  {
    question: 'Will URI work for my industry?',
    answer: 'Absolutely. URI supports SaaS, logistics, HR, fintech, FMCGs, Marketing agencies, real estate, education, e-commerce, hospitality, and more.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, new users get free credits with leads, signals, and trackers included.',
  },
  {
    question: 'Does URI replace my sales team?',
    answer: 'No — URI supports your sales team by eliminating manual research and delivering warm, high-intent opportunities every day.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes — URI uses encrypted systems and strictly follows data protection regulations in all the markets we operate in.',
  },
  {
    question: 'Can URI generate outreach messages?',
    answer: 'Yes — URI’s AI Agent generates personalised outreach messages based on the signal detected.',
  },
  {
    question: 'Can I integrate URI with my CRM?',
    answer: 'CRM integration is currently in rollout — users can export leads while native integrations are being finalized.',
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
                  <AccordionContent className="text-muted-foreground">
                    {Array.isArray(faq.answer) ? (
                      <ul className="list-disc pl-6">
                        {faq.answer.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>{faq.answer}</span>
                    )}
                  </AccordionContent>
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
