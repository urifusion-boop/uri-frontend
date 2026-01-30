import Navigation from '@/components/Navigation';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Hash, Zap } from 'lucide-react';
import Link from 'next/link';

const subFeatures = [
  {
    icon: Zap,
    title: 'Real-time Lead Alerts',
    description: 'Get instant notifications when new high-intent leads are detected. Never miss a hot opportunity with alerts delivered via email, SMS, or Slack.',
    benefits: ['Instant delivery', 'Multi-channel', 'Priority filtering', 'Custom rules'],
  },
  {
    icon: Bell,
    title: 'Sales Signal Alerts',
    description: 'Stay informed when your prospects show buying signals. From funding announcements to job changes, get alerted to the triggers that matter most.',
    benefits: ['Signal detection', 'Context-rich alerts', 'Action suggestions', 'Team routing'],
  },
  {
    icon: Hash,
    title: 'Keyword & Account Alerts',
    description: 'Set up custom alerts for specific keywords, hashtags, or accounts. Be the first to know when important conversations happen in your space.',
    benefits: ['Custom keywords', 'Account monitoring', 'Competitor tracking', 'Market trends'],
  },
];

const AlertsNotifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="container mx-auto px-6 relative">
          <Link href="/features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card rounded-2xl p-3 inline-flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Core Feature</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Alerts & <span className="text-primary">Notifications</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Never miss a critical sales moment with intelligent alerts delivered in real-time across all your channels.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex justify-center lg:justify-end">
              <img src="/assets/features/alerts-hero.png" alt="Real-time alerts and notifications" className="w-full max-w-md lg:max-w-lg object-contain" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sub-Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {subFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 glass-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss an Opportunity</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Configure your alerts and get notified the moment a high-value prospect is ready to buy.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl">
                Configure Alerts
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl">
                See Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlertsNotifications;
