import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const plans = [
  { name: 'Starter', price: '₦50,000/month', features: ['500 signals/month', '1 user', 'Email support', 'Basic CRM sync'] },
  { name: 'Professional', price: '₦150,000/month', features: ['2,500 signals/month', '5 users', 'Priority support', 'Full CRM integration', 'Custom alerts'] },
  { name: 'Enterprise', price: 'Custom pricing', features: ['Unlimited signals', 'Unlimited users', 'Dedicated success manager', 'Custom integrations', 'SLA guarantee'] },
];

const articles = [
  {
    title: 'Understanding Your Bill',
    readTime: '2 min',
    content:
      'Your monthly bill includes your base plan cost plus any overages. Overages occur when you exceed your monthly signal limit. Check Settings > Billing to view current usage and projected costs.',
  },
  {
    title: 'Upgrading or Downgrading Plans',
    readTime: '2 min',
    content: 'Go to Settings > Plan to change your subscription. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of your current billing cycle.',
  },
  {
    title: 'Adding or Removing Users',
    readTime: '2 min',
    content: 'Navigate to Settings > Team to manage users. Additional users may affect your plan pricing. Removing users does not provide refunds but prevents future charges for that seat.',
  },
  {
    title: 'Payment Methods',
    readTime: '2 min',
    content: 'We accept Visa, Mastercard, bank transfers, and Paystack. Go to Settings > Payment Methods to add or update your payment information. Nigerian Naira (₦) and USD are supported.',
  },
  {
    title: 'Requesting a Refund',
    readTime: '2 min',
    content: "Refunds are available within 14 days of purchase for annual plans if you haven't used more than 100 signals. Contact support@uri.africa with your account details to request a refund.",
  },
  {
    title: 'Cancelling Your Subscription',
    readTime: '2 min',
    content: 'Go to Settings > Plan > Cancel Subscription. Your access continues until the end of your current billing period. You can reactivate at any time by subscribing again.',
  },
];

export default function BillingHelpPage() {
  return (
    <>
      <SeoHead title="Help Center – Billing & Plans" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/help-center" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">6 Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Billing & <span className="text-primary">Plans</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Everything you need to know about pricing, payments, and managing your subscription.</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/company/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-4">{plan.price}</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
            <h2 className="text-2xl font-bold">Billing FAQ</h2>
            {articles.map((article) => (
              <div key={article.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" /> {article.readTime}
                  </span>
                </div>
                <p className="text-muted-foreground">{article.content}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 grid md:grid-cols-2 gap-6">
            <Link href="/resources/help-center/signal-detection" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Previous: Signal Detection</h3>
              <p className="text-sm text-muted-foreground mb-4">Learn how to detect and act on buying signals.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
            <Link href="/resources/help-center/security" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Next: Security & Privacy</h3>
              <p className="text-sm text-muted-foreground mb-4">Understand how we protect your data.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
