import { motion } from 'framer-motion';
import { Bot, Filter, Mail, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ProblemSolution = () => {
  const [showPublicContent, setShowPublicContent] = useState(false);
  const publicRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!publicRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowPublicContent(entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(publicRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:sticky md:top-36 md:self-start">
            {showPublicContent ? (
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Find people anywhere and everywhere</h2>
                <p className="text-lg text-muted-foreground">
                  Unlock the power of precise, automated lead generation with Uri designed to help you reach the right prospects—no matter where they are. Instantly discover verified contacts, enrich
                  your pipeline with actionable data, and scale your outreach with confidence. Whether you’re targeting niche markets or broad audiences, our platform puts the world’s professional
                  network at your fingertips.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">We Listen 24/7 So You Don't Have To</h2>
                <p className="text-lg text-muted-foreground mb-6">You can't refresh social media every 5 minutes. URI monitors your prospects all day, every day, across every platform.</p>
                <p className="text-lg text-muted-foreground mb-6">
                  The moment someone signals intent—whether it's a job change, a complaint, or an announcement—URI captures it and alerts you instantly.
                </p>
                <div className="flex items-start gap-4 p-4 bg-accent rounded-xl border border-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Real-Time Intelligence</p>
                    <p className="text-sm text-muted-foreground">Stop relying on outdated lists. Get fresh, actionable signals as they happen.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className="space-y-10">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-bold">Signal Detection</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3 opacity-40 line-through">
                      <p className="text-sm">Random social media post...</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 opacity-40 line-through">
                      <p className="text-sm">Unrelated content...</p>
                    </div>
                    <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-primary/20 rounded-lg p-3 border-2 border-primary">
                      <p className="text-sm font-semibold">🎯 High Intent: "Looking for a new CRM solution..."</p>
                    </motion.div>
                    <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="bg-primary/20 rounded-lg p-3 border-2 border-primary">
                      <p className="text-sm font-semibold">🎯 High Intent: "Just started at Company X as Head of..."</p>
                    </motion.div>
                  </div>
                </div>
                <div className="mt-6">
                  <img src="/assets/images/landing/product_screenshot.png" alt="URI Product Screenshot" className="w-full h-full object-cover rounded-xl border border-border" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Contextual Enrichment</h3>
                  <p className="text-sm text-muted-foreground">Signals are enriched with company, role, and sentiment to help you prioritize.</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1556157382-97eda2a7e676?auto=format&fit=crop&w=1600&q=60"
                  alt="Analytics dashboard visualization"
                  className="w-full h-full object-cover rounded-xl border border-border"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Role Changes</h3>
                  <p className="text-sm text-muted-foreground">Detect leadership moves and team reshuffles that indicate buying windows.</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1600&q=60"
                  alt="Professionals collaborating in modern office"
                  className="w-full h-full object-cover rounded-xl border border-border"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative" ref={publicRef}>
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Find</h3>
                  <p className="text-sm text-muted-foreground">Instantly discover verified leads and scale your outreach with precision and confidence.</p>
                </div>
                <img
                  // src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=60"
                  src="/assets/images/landing/Glbal_saas.png"
                  alt="City skyline representing market movement"
                  className="w-full h-full object-cover rounded-xl border border-border"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Instant Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified the moment high-intent signals emerge so you can act first.</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1600&q=60"
                  alt="Mobile phone receiving real-time notifications"
                  className="w-full h-full object-cover rounded-xl border border-border"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="text-center mb-2">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">Clone Your Best Sales Rep with Dera AI</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Let AI craft personalized, contextual outreach that converts.</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-strong">
                <div className="mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Before: Generic Outreach</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      Subject: <span className="line-through">Quick Question</span>
                    </p>
                    <p className="text-sm opacity-60">Hi [First Name], I hope this email finds you well...</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      Subject: <span className="line-through">Following Up</span>
                    </p>
                    <p className="text-sm opacity-60">Just circling back on my previous email...</p>
                  </div>
                  <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/30">
                    <p className="text-xs font-semibold text-destructive">❌ Low Response Rate</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary shadow-strong p-8">
                <div className="mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">After: Dera AI</h3>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-background p-4 rounded-xl mb-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Subject: <span className="font-semibold">Congrats on the wedding, Sarah! 💍</span>
                  </p>
                  <p className="text-sm leading-relaxed">
                    Hi Sarah,
                    <br />
                    <br />
                    Saw your exciting news about getting married in August! Congratulations!
                    <br />
                    <br />
                    As you plan your special day, I thought you might appreciate [Your Service]. We've helped over 500 couples in Lagos create their dream [Product/Service].
                    <br />
                    <br />
                    Would love to share some ideas. Free to chat this week?
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    ✅ Personalized
                  </motion.div>
                  <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold">✅ Contextual</div>
                  <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold">✅ Timely</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="bg-accent rounded-2xl p-8 border border-primary/20">
                <p className="text-lg font-semibold mb-3">Dera AI learns your tone, understands the context, and crafts messages that sound human—not robotic.</p>
                <p className="text-muted-foreground">Every message is tailored to the prospect's exact situation, increasing response rates by up to 5x.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
