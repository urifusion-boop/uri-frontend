import { Button } from '@/components/ui/button';
import { authRoutes } from '@/constants/ClientRoute';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const CTA = () => {
  const router = useRouter();
  return (
    <section id="start" className="py-12 sm:py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-background shadow-strong p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold text-primary">GET STARTED</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">Ready to elevate your brand?</h2>
            <p className="text-muted-foreground mt-2">Start free and explore real-time insights today.</p>
          </div>
          <div>
            <Button size="lg" className="rounded-xl shadow-strong px-6 py-5 font-semibold" onClick={() => router.push(authRoutes.signupAs)}>
              Start Free
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
