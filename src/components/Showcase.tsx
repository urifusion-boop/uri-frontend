import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

const items = [
  {
    src: '/assets/images/landing/Agriculture_Financing_Needs.png',
    alt: 'Agriculture Financing Needs',
    title: 'Agriculture Financing Needs',
    desc: 'Market signal example: financing needs in agriculture.',
  },
  {
    src: '/assets/images/landing/Glbal_saas.png',
    alt: 'Global SaaS Expansion',
    title: 'Global SaaS',
    desc: 'Global SaaS context captured for outreach.',
  },
  {
    src: '/assets/images/landing/product_screenshot.png',
    alt: 'Product Screenshot',
    title: 'Product Screenshot',
    desc: 'A look at the URI product experience.',
  },
];

const Showcase = () => {
  return (
    <section className="py-12 sm:py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-primary text-sm font-semibold tracking-wide">SHOWCASE</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            See URI <span className="text-primary">In Action</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">Real examples and a product snapshot to give you context.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover-lift"
            >
              <AspectRatio ratio={16 / 9}>
                <a href={item.src} target="_blank" rel="noreferrer" className="block w-full h-full">
                  <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                </a>
              </AspectRatio>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
