import { motion } from 'framer-motion';

const brands = [
  { name: 'ALX', logo: '/assets/images/landing/alx.svg' },
  { name: 'LSETF', logo: '/assets/images/landing/lsetf.png' },
  { name: 'EA', logo: '/assets/images/landing/ea.png' },
  { name: 'Microsoft', logo: '/assets/images/landing/microsoft.png' },
  { name: 'Massive', logo: '/assets/images/landing/ma.png' },
  { name: 'ALU', logo: '/assets/images/landing/alu.png' },
  { name: 'Culminate', logo: '/assets/images/landing/culminate.png' },
  { name: 'Goajo', logo: '/assets/images/landing/goajo.png' },
  { name: 'IAH', logo: '/assets/images/landing/iah.png' },
  { name: '3MTT', logo: '/assets/images/landing/3mtt.png' },
];

const TopBrands = () => {
  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          {/* <p className="text-primary text-sm font-semibold tracking-wide">BRANDS</p> */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            Trusted by top <span className="text-primary">Companies</span>
          </h2>
        </motion.div>

        <div className="relative mt-6 sm:mt-8 overflow-hidden group" aria-label="Trusted brands logos - auto-scrolling">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-l from-background to-transparent" />

          <div className="w-[200%]">
            <div className="flex items-center gap-6 sm:gap-8 px-2 animate-brand-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused]">
              {[...brands, ...brands].map((b, idx) => (
                <div key={`${b.name}-${idx}`} className="flex-shrink-0">
                  <div className="min-w-[120px] sm:min-w-[140px] max-w-[180px] py-3 sm:py-4 px-4 sm:px-5 rounded-xl border border-border bg-card shadow-sm hover-lift">
                    {b.logo ? (
                      <img src={b.logo} alt={b.name} className="mx-auto h-10 sm:h-12 object-contain grayscale opacity-85 transition-all duration-300 hover:grayscale-0 hover:opacity-100" />
                    ) : (
                      <p className="text-center text-foreground/70 text-sm sm:text-base tracking-wide grayscale opacity-85 transition-all duration-300 hover:grayscale-0 hover:opacity-100">{b.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
