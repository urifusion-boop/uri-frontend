import { motion } from 'framer-motion';
import { BarChart3, Bell, Bot, CalendarDays, Gauge, Hash, Smile, Target, TrendingUp, Users } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Keyword Tracking', desc: 'Monitor conversations across platforms to capture trends and signals.' },
  { icon: Users, title: 'Account Tracking', desc: 'Stay in control of performance for priority accounts and competitors.' },
  { icon: Hash, title: 'Hashtag Tracking', desc: 'Measure hashtag reach and engagement; refine campaign strategy.' },
  { icon: Target, title: 'Lead Tracking & Generation', desc: 'Identify warm prospects and buying signals; prioritize conversion.' },
  { icon: CalendarDays, title: 'Content Management', desc: 'Organize workflows, plan posts and assets in one place.' },
  { icon: Smile, title: 'Sentiment Analysis', desc: 'Understand emotions behind engagements and mentions.' },
  { icon: BarChart3, title: 'Campaign Analytics', desc: 'Measure success with rich analytics and insights.' },
  { icon: Gauge, title: 'Data-Driven Decisions', desc: 'Turn signals into strategy with clear, actionable data.' },
  { icon: Bot, title: 'AI Insight Assistant', desc: 'Ask questions, get explanations, and recommendations powered by AI.' },
  { icon: Bell, title: 'Reports & Alerts', desc: 'Daily/weekly summaries, PDF exports, and enterprise-grade alerts.' },
];

const Features = () => {
  return (
    <section id="features-overview" className="py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-primary text-sm font-semibold tracking-wide">FEATURES</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Key <span className="text-primary">Features</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">Everything you need to track conversations, uncover leads, and act with confidence.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.15 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-lg hover-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
