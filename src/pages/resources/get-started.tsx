import Navigation from '@/components/Navigation';
import Footer from '@/components/landing/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

export default function ResourcesGetStarted() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <span className="text-xs font-medium">Resources</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Getting Started on URI</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Step-by-step video guide to schedule posts across social platforms.</p>
          </motion.div>

          <div className="bg-background border-2 border-border rounded-2xl shadow-strong overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">How do I schedule posts across my social media platforms?</h2>
              <p className="text-sm text-muted-foreground mb-4">Watch the walkthrough to start using URI efficiently.</p>
            </div>
            <div className="px-2 sm:px-3 pb-4 sm:pb-6">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  className="w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/1qpvBioMUME?rel=0"
                  title="Get Started on URI"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
