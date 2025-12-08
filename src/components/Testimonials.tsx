import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const tempReviews = [
  {
    name: 'Damilola Obidairo',
    type: 'CEO of 8th Gear Ventures Studios',
    content: 'What you guys have built is a global product, and that is the highest compliment I can give to any company.',
    image: '/assets/images/landing/gear.jpg',
  },
  {
    name: 'Joshua War',
    type: 'ALX',
    content: 'I think what you’re doing is really fascinating. Social media is the new battleground, and data is essential for driving decision-making.',
    image: '/assets/images/landing/alx.svg',
  },
  {
    name: 'Adekemi Rasheedat',
    type: 'Digital Marketer & Content Creator',
    content: 'Uri helped me boost engagement like never before and significantly improved my results',
    image: '/assets/images/landing/kemi.jpg',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-12 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-14">
          <p className="text-primary text-sm font-semibold tracking-wide">TESTIMONIAL</p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            What <span className="text-primary">Our Users</span> Say
          </h3>
          <p className="max-w-3xl mx-auto text-center text-muted-foreground text-base md:text-lg mt-3">See How Uri is Empowering Clients and Creatives to Achieve Remarkable Results</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {tempReviews.map((review, index) => (
            <motion.div key={review.name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 3) * 0.15 }}>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg hover-lift h-full flex flex-col">
                <Quote className="w-8 h-8 text-primary mb-4" />
                <p className="text-base md:text-lg leading-relaxed mb-6 flex-1">{review.content}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={`${review.name} avatar`}
                    className="w-12 h-12 rounded-full border border-primary/20 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=CD1B78&color=fff`;
                    }}
                  />
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.type}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
