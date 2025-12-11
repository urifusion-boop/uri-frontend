import { Button } from '@/components/ui/button';
import { authRoutes } from '@/constants/ClientRoute';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import { Globe, Search } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const queries = [
  'Find me people interested in buying tomatoes in Lekki...',
  'Look for people complaining about rent in Lagos...',
  'Find recruiters at international Tech companies hiring AI engineers...',
];

const Hero = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryIndex, setQueryIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = isDeleting ? 30 : 80;
    const currentFullQuery = queries[queryIndex];

    if (!isDeleting && charIndex === currentFullQuery.length) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setQueryIndex((prev) => (prev + 1) % queries.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentQuery(currentFullQuery.substring(0, charIndex));
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, queryIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,183,197,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Globe className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Built for the nuances of the African Market.</span>
          </motion.div>

          {/* Headline */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight px-4"
          >
            You have built the solution.
            <br />
            <span className="text-primary">Let us find the people who need it!</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto px-4"
          >
            URI monitors the web 24/7 to spot decision-makers, capture real-time buying signals, and engage prospects instantly.
          </motion.p>

          {/* Interactive Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-3xl mx-auto mb-4 px-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-background border-2 border-border rounded-2xl p-2 shadow-strong">
                <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-3 sm:py-4">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={currentQuery}
                    readOnly
                    className="flex-1 bg-transparent text-sm sm:text-base md:text-lg outline-none text-foreground placeholder:text-muted-foreground"
                    placeholder="What are you looking for?"
                  />
                  <span className="w-0.5 h-5 sm:h-6 bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Promise Text */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm text-muted-foreground mb-8 italic">
            If your customer is out there, we will find them.
          </motion.p>

          {/* CTA */}
          {!isAuthenticated && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="px-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-hover text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-strong hover-lift font-semibold"
                onClick={() => router.push(authRoutes.login)}
              >
                Start Free
                <span className="ml-2 text-xs opacity-70 hidden sm:inline">No credit card required</span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
