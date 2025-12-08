import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, TrendingUp, Users } from 'lucide-react';

const CaseStudy = () => {
  const metrics = [
    {
      label: 'Conversion Rate',
      before: '2.3%',
      after: '9.2%',
      increase: '+300%',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Response Time',
      before: '48 hours',
      after: '6 hours',
      increase: '-87%',
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Monthly Revenue',
      before: '₦12M',
      after: '₦48M',
      increase: '+300%',
      icon: DollarSign,
      color: 'text-primary',
    },
    {
      label: 'Qualified Leads',
      before: '150/month',
      after: '620/month',
      increase: '+313%',
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            Customer Success Story
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How Sendsafe Increased Conversions by 300%</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A leading Nigerian logistics company transformed their lead generation strategy and closed deals 4x faster with URI's contextual intelligence.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Company Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-8 mb-12 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                <p className="text-muted-foreground mb-4">
                  Sendsafe, a fast-growing logistics company serving 500+ businesses in Lagos, struggled to close deals quicker. Their sales team spent hours cold calling and manually searching social
                  media for leads, missing real opportunities.
                </p>
                <div className="bg-muted/50 border-l-4 border-destructive p-4 rounded">
                  <p className="text-sm font-semibold mb-2">The Problem:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No real-time visibility into buying signals</li>
                    <li>• 48-hour delay in responding to market opportunities</li>
                    <li>• Low conversion rate from cold outreach (2.3%)</li>
                    <li>• Sales team overwhelmed with manual research</li>
                  </ul>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">The Solution</h3>
                <p className="text-muted-foreground mb-4">
                  Sendsafe adopted URI to monitor the market 24/7 for companies announcing expansion, relocation, inventory issues, or dissatisfaction with their current logistics provider.
                </p>
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                  <p className="text-sm font-semibold mb-2">What URI Did:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Detected buying signals in real time</li>
                    <li>• Identified companies complaining about logistics delays</li>
                    <li>• Flagged businesses announcing warehouse expansions</li>
                    <li>• Auto-generated personalised outreach messages</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">The Results</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 shadow-lg hover-lift"
                >
                  <metric.icon className={`w-8 h-8 mb-4 ${metric.color}`} />
                  <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>

                  {/* Before/After */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Before:</span>
                      <span className="font-semibold line-through opacity-60">{metric.before}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">After:</span>
                      <span className="text-2xl font-bold text-foreground">{metric.after}</span>
                    </div>
                  </div>

                  {/* Increase Badge */}
                  <div className={`inline-flex items-center gap-1 bg-primary/10 ${metric.color} px-3 py-1 rounded-full text-sm font-bold`}>
                    <ArrowRight className="w-3 h-3" />
                    {metric.increase}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20 mb-12"
          >
            <div className="text-6xl text-primary mb-4 font-serif">"</div>
            <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
              URI changed everything for us. We went from chasing cold leads to having qualified prospects reaching out to us. Our sales team now focuses on closing deals, not finding them.
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl font-bold">CM</div>
              <div>
                <div className="font-semibold">David</div>
                <div className="text-sm text-muted-foreground">CEO, Sendsafe Logistics</div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold mb-8 text-center">90-Day Transformation Timeline</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="font-semibold mb-1">Week 1-2: Setup & Training</div>
                  <p className="text-sm text-muted-foreground">URI configured to monitor Lagos market for logistics buying signals. Team trained on platform.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="font-semibold mb-1">Week 3-4: First Results</div>
                  <p className="text-sm text-muted-foreground">150% increase in qualified leads. First major deal closed from a real-time social signal.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">3</div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="font-semibold mb-1">Month 2: Scaling Up</div>
                  <p className="text-sm text-muted-foreground">Sales team fully transitioned to URI-driven leads. Cold calling reduced by 80%.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">✓</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Month 3: Full Impact</div>
                  <p className="text-sm text-muted-foreground">300% increase in conversions achieved. Monthly revenue quadrupled.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Lead Generation?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Join Sendsafe and hundreds of other businesses using URI to capture leads that others miss.</p>
            <Button size="lg" className="text-lg px-8 hover-scale">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
