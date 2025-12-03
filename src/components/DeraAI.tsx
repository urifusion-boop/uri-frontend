import { motion } from 'framer-motion';
import { Bot, Mail, Sparkles } from 'lucide-react';

const DeraAI = () => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Clone Your Best Sales Rep with Dera AI</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Let AI craft personalized, contextual outreach that converts.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto items-center">
          {/* Before: Messy Inbox */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Before: Generic Outreach</h3>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-lg p-6 space-y-3">
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
          </motion.div>

          {/* After: Dera AI */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">After: Dera AI</h3>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary shadow-strong p-6">
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
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
                  ✅ Personalized
                </motion.div>
                <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold">✅ Contextual</div>
                <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold">✅ Timely</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlight */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 max-w-3xl mx-auto text-center">
          <div className="bg-accent rounded-2xl p-8 border border-primary/20">
            <p className="text-lg font-semibold mb-3">Dera AI learns your tone, understands the context, and crafts messages that sound human—not robotic.</p>
            <p className="text-muted-foreground">Every message is tailored to the prospect's exact situation, increasing response rates by up to 5x.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeraAI;
