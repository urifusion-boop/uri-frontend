import footerBackground from '@/assets/footer-background.png';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative">
      {/* Background Image Section */}
      <div className="relative h-[200px] sm:h-[280px] md:h-[320px] overflow-hidden">
        <Image src={footerBackground} alt="" fill priority className="object-cover object-center" />
        {/* Gradient overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>

      {/* Main Footer Card */}
      <div className="relative -mt-16 sm:-mt-24 md:-mt-32 px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-7xl mx-auto bg-card rounded-3xl shadow-xl overflow-hidden">
          {/* CTA Section */}
          <div className="p-8 sm:p-12 lg:p-16 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left: Headline + CTA */}
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">Your customers are speaking, Are you listening?</h2>
                <Button size="large" className="bg-foreground text-background hover:bg-foreground/90 text-base px-6 py-6 rounded-xl font-semibold group">
                  Start building for free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Right: Logo + Social */}
              <div className="flex flex-col items-start lg:items-end gap-6">
                <img src="/assets/images/landing/logo.png" alt="URI" className="h-10 sm:h-12" />
                <div className="flex items-center gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Product */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#signals" className="text-muted-foreground hover:text-foreground transition-colors">
                      Signals
                    </a>
                  </li>
                  <li>
                    <a href="#integrations" className="text-muted-foreground hover:text-foreground transition-colors">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tools */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Tools</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#lead-finder" className="text-muted-foreground hover:text-foreground transition-colors">
                      Lead Finder
                    </a>
                  </li>
                  <li>
                    <a href="#crm-sync" className="text-muted-foreground hover:text-foreground transition-colors">
                      CRM Sync
                    </a>
                  </li>
                  <li>
                    <a href="#roi-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                      ROI Calculator
                    </a>
                  </li>
                  <li>
                    <a href="#chrome-extension" className="text-muted-foreground hover:text-foreground transition-colors">
                      Chrome Extension
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#guides" className="text-muted-foreground hover:text-foreground transition-colors">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="#case-studies" className="text-muted-foreground hover:text-foreground transition-colors">
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a href="#help-center" className="text-muted-foreground hover:text-foreground transition-colors">
                      Help Center
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#careers" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                      Careers
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Hiring!</span>
                    </a>
                  </li>
                  <li>
                    <a href="#partners" className="text-muted-foreground hover:text-foreground transition-colors">
                      Partners
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#compliance" className="text-muted-foreground hover:text-foreground transition-colors">
                      NDPR Compliance
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} URI. All rights reserved.</p>
              <p className="text-sm text-muted-foreground">Built for Africa 🌍</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
