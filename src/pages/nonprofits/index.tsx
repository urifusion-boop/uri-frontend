import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Globe, Heart, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';

const nonprofitsCartoon = '/assets/images/landing/nonprofits-cartoon.png';

const benefits = [
  {
    icon: Heart,
    title: 'Stay on Top of Conversations That Matter',
    description: 'Monitor conversations about causes you care about and identify communities in need of your support.',
  },
  {
    icon: Globe,
    title: 'Power Missionary & Outreach Work',
    description: 'Find people seeking guidance, support, or community—and reach them with timely, meaningful engagement.',
  },
  {
    icon: Users,
    title: 'Grow Your Community',
    description: 'Identify potential donors, volunteers, and advocates who share your mission and values.',
  },
  {
    icon: MessageCircle,
    title: 'Amplify Your Impact',
    description: 'Track conversations about your cause to understand where help is needed most and measure your outreach effectiveness.',
  },
];

const features = [
  'Monitor conversations about your cause',
  'Find people in need of support',
  'Identify potential donors and volunteers',
  'Track community sentiment and needs',
  'Non-profit friendly pricing',
  'Integration with fundraising tools',
];

const NonprofitsPage = () => {
  return (
    <>
      <SeoHead title="For Non-Profits" />
      <Navigation />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="container mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">For Non-Profits</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                <span className="text-primary">Do Good</span> with Real-Time Insights
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Use URI to stay on top of conversations that matter, support missionary work, and connect with communities who need your help the most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  Contact for Non-Profit Pricing
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-5xl mx-auto mb-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10">
              <img src={nonprofitsCartoon} alt="Non-profit volunteers helping community" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Use Case Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">How Non-Profits Use URI</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Faith-Based Organizations</h3>
                <p className="text-muted-foreground text-sm">"Find people in Lagos seeking spiritual guidance and community support"</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Disaster Relief</h3>
                <p className="text-muted-foreground text-sm">"Monitor conversations about flooding in Kogi to coordinate relief efforts"</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Education Initiatives</h3>
                <p className="text-muted-foreground text-sm">"Find parents in rural areas asking about scholarship opportunities"</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Health Campaigns</h3>
                <p className="text-muted-foreground text-sm">"Track conversations about maternal health needs in underserved communities"</p>
              </div>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Features for Impact-Driven Organizations</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-16">
            <Link href="/company/contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                Get Non-Profit Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NonprofitsPage;
