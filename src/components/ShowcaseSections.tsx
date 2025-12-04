import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

const sections = [
  // {
  //   title: 'Agriculture Financing Signals',
  //   desc: 'Identify financing needs in agriculture and engage decision-makers when intent is clear. URI surfaces timely signals you can act on.',
  //   img: '/assets/images/landing/Agriculture_Financing_Needs.png',
  // },
  {
    title: 'Find people anywhere and everywhere',
    desc: 'Unlock the power of precise, automated lead generation with Uri designed to help you reach the right prospects—no matter where they are. Instantly discover verified contacts, enrich your pipeline with actionable data, and scale your outreach with confidence. Whether you’re targeting niche markets or broad audiences, our platform puts the world’s professional network at your fingertips.',
    img: '/assets/images/landing/Glbal_saas.png',
  },
  // {
  //   title: 'Generate Reports Easily',
  //   desc: 'Create and share clean, actionable performance reports. Keep stakeholders aligned with data that tells a clear story.',
  //   img: '/assets/images/landing/How_to_generate_reports.png',
  // },
  // {
  //   title: 'Product Snapshot',
  //   desc: 'A look at URI’s product experience — designed for speed, clarity, and real-time intelligence.',
  //   img: '/assets/images/landing/product_screenshot.png',
  // },
];

const ShowcaseSections = () => {
  return (
    <section className="py-12 sm:py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-primary text-sm font-semibold tracking-wide">IN CONTEXT</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Context + <span className="text-primary">Design</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">Short explanations paired with visuals. Alternating layout for rhythm and clarity.</p>
        </motion.div> */}

        <div className="space-y-10 sm:space-y-14">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 2) * 0.1 }}
              className="grid md:grid-cols-2 gap-6 md:gap-10 items-center max-w-6xl mx-auto"
            >
              <div className={i % 2 === 1 ? 'md:order-last' : ''}>
                <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground mb-5">{s.desc}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium">Real Examples</span>
                </div>
              </div>

              <div className={i % 2 === 1 ? 'md:order-first' : ''}>
                <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  </AspectRatio>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSections;
