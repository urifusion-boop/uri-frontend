import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'What is URI?',
    a: 'A platform to connect data insights, tracking, and lead generation to business outcomes.',
  },
  {
    q: 'Is it free?',
    a: 'We offer a free trial and tiered plans; some features are paid.',
  },
  {
    q: 'Can I edit my profile or workflows?',
    a: 'Yes — profiles, trackers, and forms are customizable.',
  },
  {
    q: 'How do reviews/ratings work?',
    a: 'Feedback systems promote transparency and trust.',
  },
  {
    q: 'Which creatives or categories are supported?',
    a: 'A broad range — tailor trackers to your industry and goals.',
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
                <Typography className="text-muted-foreground">{f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
