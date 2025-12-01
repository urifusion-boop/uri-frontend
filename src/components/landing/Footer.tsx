import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 py-12 sm:pb-2">
      <div className="container mx-auto px-4 sm:px-6">
        {/* CTA Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ready to stop searching and start closing?</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join hundreds of sales teams already using URI to capture the leads everyone else misses.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-strong hover-lift font-semibold">
            Sign Up for Free
          </Button>
        </motion.div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-12 max-w-6xl mx-auto">
          <div>
            <h3 className="font-bold text-xl mb-2">URI</h3>
            <p className="text-sm text-muted-foreground italic">Enhancing Business Growth</p>
            <p className="text-sm text-muted-foreground mt-2">Transform your business to thrive in a digitized and connected world driven by software innovation.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-foreground transition-colors">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#integrations" className="hover:text-foreground transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#solutions" className="hover:text-foreground transition-colors">
                  For Agencies
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-foreground transition-colors">
                  For Startups
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-foreground transition-colors">
                  For Business
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-foreground transition-colors">
                  For Product Teams
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-foreground transition-colors">
                  For Media & Entertainment
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-foreground font-semibold">+234-707-630-7855</p>
              <a href="mailto:hello@uri.africa" className="hover:text-foreground transition-colors">
                hello@uri.africa
              </a>
              {/* <a
                href="#contact"
                className="inline-block rounded-xl px-4 py-2 bg-primary text-primary-foreground font-semibold shadow-strong hover:opacity-90 transition-opacity"
              >
                Contact Us
              </a> */}
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-border py-3 px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <a href="#terms" className="hover:text-foreground transition-colors hover:underline">
                Terms of Use
              </a>
              <span className="text-border">|</span>
              <a href="#faqs" className="hover:text-foreground transition-colors hover:underline">
                Faqs
              </a>
              <span className="text-border">|</span>
              <a href="#privacy" className="hover:text-foreground transition-colors hover:underline">
                Privacy Policy
              </a>
              <span className="text-border">|</span>
              <a href="#security" className="hover:text-foreground transition-colors hover:underline">
                Security
              </a>
              <span className="text-border">|</span>
              <a href="#accessibility" className="hover:text-foreground transition-colors hover:underline">
                Accessibility
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/p/Cn19gyDHqVNni2ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://x.com/uricreative" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/uri-creative/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com/@UriCreative" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>

            <p className="text-muted-foreground">© 2025 Uri Creative. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
