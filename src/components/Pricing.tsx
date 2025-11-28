import { motion } from 'framer-motion';

const plans = [
  { name: 'Standard', price: '₦35k', badge: 'Starter', features: ['Up to 2 keyword trackers', '2 social accounts', '2 hashtags', 'Lead tracking', 'Content management'] },
  {
    name: 'Professional',
    price: '₦160k',
    badge: 'Teams',
    features: ['Up to 3 keyword trackers', '3 social accounts', '3 hashtags', 'Lead tracking', 'Content management', 'AI assistant', 'Report generation', 'Daily reports'],
    highlight: true,
  },
  {
    name: 'Business',
    price: '₦240k',
    badge: 'Growth',
    features: ['Up to 7 keyword trackers', '6 social accounts', '7 hashtags', 'Lead tracking', 'Content management', 'AI assistant', 'Report generation', 'Team collaboration'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    badge: 'Scale',
    features: ['Unlimited trackers/social/accounts/hashtags', 'Advanced AI assistant', 'Full report generation', 'Team collaboration', 'Alerts & advanced support', 'PDF reports, weekly summaries'],
  },
];

const highlights = [
  'Lead Credits from 70 credits & 1000 leads (Standard) up to unlimited (Enterprise)',
  'AI Recommendations and Insight Assistant from Professional plan upwards',
  'Daily/weekly summaries and PDF exports available on higher tiers',
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
          <p className="text-primary text-sm font-semibold tracking-wide">PRICING</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Plans & <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">Choose the plan that fits your stage and scale.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1 }}
              whileHover={plan.highlight ? { scale: 1.03, rotate: 0.25 } : { scale: 1.02 }}
            >
              <div className={`rounded-2xl border shadow-lg p-6 h-full ${plan.highlight ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary' : 'bg-card border-border'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{plan.badge}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-3xl font-extrabold mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-primary/20 inline-block" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#start"
                  className="block text-center rounded-xl px-4 py-3 font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity glow-pink"
                >
                  Start Free Trial
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h4 className="text-lg font-bold mb-3">Highlights</h4>
            <ul className="space-y-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/20 inline-block mt-1" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
