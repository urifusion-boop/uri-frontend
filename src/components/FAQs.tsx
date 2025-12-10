import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'What is URI?',
    a: 'URI is an AI-powered platform that detects buying intent, finds verified decision-makers, and generates sales opportunities automatically.',
  },
  {
    q: 'How does URI find leads?',
    a: 'URI scans the internet — LinkedIn, X, Facebook, news platforms, forums, and company pages — to detect sales signals and high-intent triggers.',
  },
  {
    q: 'What kind of signals does URI track?',
    a: [
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
    q: 'Who is URI built for?',
    a: 'Business owners, sales teams, marketers, founders, agencies, and anyone who needs a steady flow of verified leads and real-time market insights.',
  },
  {
    q: 'Does URI provide verified contact details?',
    a: 'Yes — URI enriches leads with email, phone number, social links, role, company info, and more (based on availability).',
  },
  {
    q: 'How fast are the alerts?',
    a: 'Instant. URI notifies you the moment a buying signal is detected.',
  },
  {
    q: 'Can I customize my trackers?',
    a: 'Yes — you can customize keywords, hashtags, industries, decision-maker roles, and company types you want to track.',
  },
  {
    q: 'Will URI work for my industry?',
    a: 'Absolutely. URI supports SaaS, logistics, HR, fintech, FMCGs, Marketing agencies, real estate, education, e-commerce, hospitality, and more.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes, new users get free credits with leads, signals, and trackers included.',
  },
  {
    q: 'Does URI replace my sales team?',
    a: 'No — URI supports your sales team by eliminating manual research and delivering warm, high-intent opportunities every day.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes — URI uses encrypted systems and strictly follows data protection regulations in all the markets we operate in.',
  },
  {
    q: 'Can URI generate outreach messages?',
    a: 'Yes — URI’s AI Agent generates personalised outreach messages based on the signal detected.',
  },
  {
    q: 'Can I integrate URI with my CRM?',
    a: 'CRM integration is currently in rollout — users can export leads while native integrations are being finalized.',
  },
];

const FAQs = () => {
  return (
    <section id="faqs" className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
          <p className="text-primary text-sm font-semibold tracking-wide">FAQS</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">Answers to common questions about getting started, plans, and features.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((f, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Array.isArray(f.a) ? (
                  <ul className="list-disc pl-6 text-muted-foreground">
                    {f.a.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography className="text-muted-foreground">{f.a}</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
