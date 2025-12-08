import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bell, Check, Chrome, Download, Eye, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  { icon: Eye, title: 'LinkedIn Insights', description: 'See buying signals directly on LinkedIn profiles as you browse potential prospects.' },
  { icon: Bell, title: 'Real-time Alerts', description: "Get notified instantly when someone you're viewing shows recent buying intent." },
  { icon: Zap, title: 'One-Click Save', description: 'Save promising leads to URI with a single click, complete with their signal history.' },
];

const compatibility = ['Google Chrome', 'Microsoft Edge', 'Brave Browser', 'Opera'];

export default function ChromeExtensionPage() {
  return (
    <>
      <SeoHead title="Chrome Extension" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Chrome className="w-10 h-10 text-primary" />
            </div>
            <span className="text-primary font-medium mb-4 block">Chrome Extension</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              URI Insights
              <span className="text-primary"> Everywhere</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Access buying signals and prospect intelligence directly in your browser while browsing LinkedIn, Twitter, and the web.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
                <h3 className="font-semibold mb-2">Install Extension</h3>
                <p className="text-sm text-muted-foreground">Add the URI extension to your Chrome browser in one click.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
                <h3 className="font-semibold mb-2">Connect Account</h3>
                <p className="text-sm text-muted-foreground">Log in with your URI account to sync your preferences.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
                <h3 className="font-semibold mb-2">Start Browsing</h3>
                <p className="text-sm text-muted-foreground">See URI insights overlaid on profiles as you browse.</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold mb-6">Browser Compatibility</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {compatibility.map((browser) => (
                <span key={browser} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  {browser}
                </span>
              ))}
            </div>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/company/contact">
                <Download className="w-4 h-4 mr-2" />
                Download Extension
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Requires Pro plan or higher</p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
