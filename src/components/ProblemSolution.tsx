import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { Activity, ArrowUpRight, BarChart3, Bot, CheckCircle, Clock, Filter, Inbox, PieChart, Send, Sparkles, TrendingUp, Users } from 'lucide-react';
import React, { useRef } from 'react';

type Feature = { icon: React.ComponentType<{ className?: string }>; text: string };

interface ExtendedStoryStage {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  features?: Feature[];
  image: string;
  image2: string;
  secondaryVisual: 'chart-metrics' | 'live-monitoring' | 'lead-cards' | 'ai-messages';
  customContent?: React.ReactNode;
}

const stages: ExtendedStoryStage[] = [
  {
    id: 'find-anywhere',
    subtitle: 'Find',
    title: 'Find people anywhere and everywhere',
    description:
      'Uri helps you instantly discover verified contacts, enrich your pipeline, and reach the right prospects fast. Whether your audience is niche or broad, Uri puts the world’s professional network at your fingertips.',
    features: [
      { icon: Filter, text: 'Signal Detection' },
      { icon: TrendingUp, text: 'Real-Time Intelligence' },
    ],
    image: '/assets/images/landing/Top companies & Roles (Uri).png',
    image2: '/assets/images/landing/Individual Leads(Uri).png',
    secondaryVisual: 'chart-metrics',
  },
  {
    id: 'contextual-enrichment',
    subtitle: 'Enrichment',
    title: 'Contextual Enrichment',
    description: 'Signals are enriched with company, role, and sentiment to help you prioritize.',
    image: '/assets/images/landing/How_to_generate_reports.png',
    image2: '/assets/images/landing/Report (uri).png',
    secondaryVisual: 'chart-metrics',
    customContent: (
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
    ),
  },
  {
    id: 'dera-ai-outreach',
    subtitle: 'Outreach',
    title: 'Dera AI',
    description:
      "Dera AI learns your tone, understands the context, and crafts messages that sound human—not robotic. Every message is tailored to the prospect's exact situation, increasing response rates by up to 5x.",
    features: [
      { icon: Bot, text: 'Personalized Messages' },
      { icon: Sparkles, text: 'Contextual Responses' },
    ],
    image: '/assets/images/landing/Individual Leads(Uri).png',
    image2: '/assets/images/landing/Top companies & Roles (Uri).png',
    secondaryVisual: 'ai-messages',
    // customContent: (
    //   <div className="space-y-4">
    //     <div className="mb-4 flex items-center gap-2">
    //       <Mail className="w-5 h-5 text-muted-foreground" />
    //       <h3 className="font-semibold text-lg">Before: Generic Outreach</h3>
    //     </div>
    //     <div className="space-y-3">
    //       <div className="bg-muted/50 p-4 rounded-lg">
    //         <p className="text-xs text-muted-foreground mb-2">
    //           Subject: <span className="line-through">Quick Question</span>
    //         </p>
    //         <p className="text-sm opacity-60">Hi [First Name], I hope this email finds you well...</p>
    //       </div>
    //       <div className="bg-muted/50 p-4 rounded-lg">
    //         <p className="text-xs text-muted-foreground mb-2">
    //           Subject: <span className="line-through">Following Up</span>
    //         </p>
    //         <p className="text-sm opacity-60">Just circling back on my previous email...</p>
    //       </div>
    //       <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/30">
    //         <p className="text-xs font-semibold text-destructive">❌ Low Response Rate</p>
    //       </div>
    //     </div>
    //     <div className="bg-background p-4 rounded-xl mb-4">
    //       <p className="text-xs text-muted-foreground mb-2">
    //         Subject: <span className="font-semibold">Congrats on the wedding, Sarah! 💍</span>
    //       </p>
    //       <p className="text-sm leading-relaxed">
    //         Hi Sarah,
    //         <br />
    //         <br />
    //         Saw your exciting news about getting married in August! Congratulations!
    //         <br />
    //         <br />
    //         As you plan your special day, I thought you might appreciate [Your Service]. We've helped over 500 couples in Lagos create their dream [Product/Service].
    //         <br />
    //         <br />
    //         Would love to share some ideas. Free to chat this week?
    //       </p>
    //     </div>
    //     <div className="flex items-center gap-3">
    //       <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">
    //         ✅ Personalized
    //       </motion.div>
    //       <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold">✅ Contextual</div>
    //       <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold">✅ Timely</div>
    //     </div>
    //   </div>
    // ),
  },
  {
    id: 'listen-247',
    subtitle: 'Always-On Monitoring',
    title: "We Listen 24/7 So You Don't Have To",
    description:
      "You can't refresh social media every 5 minutes. URI monitors your prospects all day, every day, across every platform. The moment someone signals intent—whether it's a job change, a complaint, or an announcement—URI captures it and alerts you instantly.",
    features: [{ icon: TrendingUp, text: 'Real-Time Intelligence' }],
    image: '/assets/images/landing/Report (uri).png',
    image2: '/assets/images/landing/How_to_generate_reports.png',
    secondaryVisual: 'live-monitoring',
  },
];

const ChartMetricsVisual = () => (
  <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-2 sm:mb-3">
      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      <span className="text-xs sm:text-sm font-medium text-foreground">Weekly Performance</span>
    </div>
    <div className="flex items-end gap-1 sm:gap-2 h-12 sm:h-16">
      {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
        <motion.div key={i} className="flex-1 bg-primary/20 rounded-t" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} />
      ))}
    </div>
    <div className="flex justify-between mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
      <span>Mon</span>
      <span>Sun</span>
    </div>
    <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2">
      <div className="bg-primary/10 rounded-lg p-1.5 sm:p-2">
        <div className="text-sm sm:text-lg font-bold text-foreground">2.4k</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">Signals</div>
      </div>
      <div className="bg-primary/10 rounded-lg p-1.5 sm:p-2">
        <div className="text-sm sm:text-lg font-bold text-foreground flex items-center gap-1">
          +34% <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">Growth</div>
      </div>
    </div>
  </div>
);

const LiveMonitoringVisual = () => (
  <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-2 sm:mb-3">
      <motion.div className="w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
      <span className="text-xs sm:text-sm font-medium text-foreground">Live Monitoring</span>
    </div>
    <div className="space-y-1.5 sm:space-y-2">
      {[
        { time: '2s ago', type: 'Job Change' },
        { time: '15s ago', type: 'Announcement' },
        { time: '1m ago', type: 'Complaint' },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between p-1.5 sm:p-2 bg-background/50 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">{item.time}</span>
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-primary">{item.type}</span>
        </motion.div>
      ))}
    </div>
    <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
      <span>24/7 Active</span>
    </div>
  </div>
);

const SecondaryVisual = ({ type }: { type: ExtendedStoryStage['secondaryVisual'] }) => {
  switch (type) {
    case 'chart-metrics':
      return <ChartMetricsVisual />;
    case 'live-monitoring':
      return <LiveMonitoringVisual />;
    case 'lead-cards':
      return (
        <div className="space-y-2 sm:space-y-3">
          {[
            { name: 'Chioma Eze', score: 92, signal: 'Looking for solar installers' },
            { name: 'Tunde Bakare', score: 87, signal: 'Hiring AI engineers' },
          ].map((lead, i) => (
            <motion.div
              key={i}
              className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-2 sm:p-3 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="font-medium text-xs sm:text-sm text-foreground">{lead.name}</span>
                <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full">{lead.score}%</span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 truncate">"{lead.signal}"</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                <span className="text-[10px] sm:text-xs text-green-600">High Intent</span>
              </div>
            </motion.div>
          ))}
        </div>
      );
    case 'ai-messages':
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Dera AI Draft</span>
          </div>
          <motion.div className="bg-primary/10 rounded-lg p-2 sm:p-3 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[10px] sm:text-xs text-foreground leading-relaxed line-clamp-3">
              "Hi Chioma, I noticed you're exploring solar solutions for your Lekki property. We've helped 50+ Lagos homeowners..."
            </p>
          </motion.div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              <span>Personalized</span>
            </div>
            <motion.div className="flex items-center gap-1 text-primary text-[10px] sm:text-xs font-medium" whileHover={{ scale: 1.05 }}>
              <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Send</span>
            </motion.div>
          </div>
        </div>
      );
  }
};

const DashboardMetricsVisual = () => (
  <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-2 sm:mb-3">
      <PieChart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      <span className="text-xs sm:text-sm font-medium text-foreground">Report Summary</span>
    </div>
    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
      <div className="bg-primary/10 rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-base sm:text-xl font-bold text-foreground">847</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">Total Leads</div>
      </div>
      <div className="bg-green-500/10 rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-base sm:text-xl font-bold text-green-600">23%</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">Converted</div>
      </div>
    </div>
  </div>
);

const AlertFeedVisual = () => (
  <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-2 sm:mb-3">
      <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      <span className="text-xs sm:text-sm font-medium text-foreground">Alert Feed</span>
    </div>
    <div className="space-y-1.5">
      {['New signal from Twitter', 'LinkedIn mention detected', 'High-intent lead found'].map((alert, i) => (
        <motion.div key={i} className="flex items-center gap-2 p-1.5 bg-background/50 rounded-lg" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{alert}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const SecondaryVisual2 = ({ type }: { type: ExtendedStoryStage['secondaryVisual'] }) => {
  switch (type) {
    case 'chart-metrics':
      return <DashboardMetricsVisual />;
    case 'live-monitoring':
      return <AlertFeedVisual />;
    case 'lead-cards':
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Lead Queue</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs text-primary font-medium">{i}</span>
                </div>
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-primary">+12 new</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, delay: 0.3 }} />
          </div>
        </div>
      );
    case 'ai-messages':
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Inbox className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Outreach Stats</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Sent', value: 156, color: 'bg-primary' },
              { label: 'Opened', value: 89, color: 'bg-blue-500' },
              { label: 'Replied', value: 34, color: 'bg-green-500' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 sm:w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`${stat.color} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / 156) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-foreground w-6 text-right">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
  }
};

interface StageComponentProps {
  stage: ExtendedStoryStage;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalStages: number;
}

const StageText = ({ stage, index, scrollYProgress, totalStages }: StageComponentProps) => {
  const stageStart = (index * 2) / (totalStages * 2);
  const stageEnd = ((index + 1) * 2) / (totalStages * 2);

  const opacity = useTransform(
    scrollYProgress,
    index === 0 ? [0, 0.02, stageEnd - 0.02, stageEnd] : index === totalStages - 1 ? [stageStart, stageStart + 0.02, 1] : [stageStart, stageStart + 0.02, stageEnd - 0.02, stageEnd],
    index === 0 ? [1, 1, 1, 0] : index === totalStages - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, index === 0 ? [0, stageEnd] : [stageStart, stageEnd], index === 0 ? [0, -15] : [15, 0]);

  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
      <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">{stage.subtitle}</span>
      <h3 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-foreground leading-tight mb-5">{stage.title}</h3>
      <p className="text-muted-foreground text-base xl:text-lg leading-relaxed mb-6 max-w-xl">{stage.description}</p>
      {stage.features && (
        <div className="space-y-3">
          {stage.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      )}
      {stage.customContent && <div className="mt-6">{stage.customContent}</div>}
    </motion.div>
  );
};

const StageImages = ({ stage, index, scrollYProgress, totalStages }: StageComponentProps) => {
  const stageStart = (index * 2) / (totalStages * 2);
  const stageMid = (index * 2 + 1) / (totalStages * 2);
  const stageEnd = ((index + 1) * 2) / (totalStages * 2);

  const opacity1 = useTransform(
    scrollYProgress,
    index === 0 ? [0, 0.02, stageMid - 0.03, stageMid] : [stageStart, stageStart + 0.02, stageMid - 0.03, stageMid],
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0]
  );
  const scale1 = useTransform(scrollYProgress, [stageStart, stageMid], [1, 0.95]);
  const y1 = useTransform(scrollYProgress, [stageStart, stageMid], [0, -30]);

  const opacity2 = useTransform(
    scrollYProgress,
    index === totalStages - 1 ? [stageMid - 0.02, stageMid + 0.02, 1] : [stageMid - 0.02, stageMid + 0.02, stageEnd - 0.02, stageEnd],
    index === totalStages - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const scale2 = useTransform(scrollYProgress, [stageMid, stageEnd], [0.95, 1]);
  const y2 = useTransform(scrollYProgress, [stageMid, stageEnd], [30, 0]);

  return (
    <>
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: opacity1, scale: scale1, y: y1 }}>
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-4 bg-primary/15 rounded-3xl blur-2xl opacity-60" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <img src={stage.image} alt={`${stage.title} - View 1`} className="w-full h-auto" />
          </div>
        </div>
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: opacity2, scale: scale2, y: y2 }}>
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-4 bg-primary/15 rounded-3xl blur-2xl opacity-60" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <img src={stage.image2} alt={`${stage.title} - View 2`} className="w-full h-auto" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

interface StageIndicatorProps {
  index: number;
  subIndex: number;
  scrollYProgress: MotionValue<number>;
  totalStages: number;
}

const StageIndicator = ({ index, subIndex, scrollYProgress, totalStages }: StageIndicatorProps) => {
  const subStageIndex = index * 2 + subIndex;
  const totalSubStages = totalStages * 2;
  const subStageStart = subStageIndex / totalSubStages;
  const subStageEnd = (subStageIndex + 1) / totalSubStages;
  const subStageMid = (subStageStart + subStageEnd) / 2;

  const isActive = useTransform(scrollYProgress, [subStageStart, subStageMid, subStageEnd], [0, 1, 0]);
  const scale = useTransform(isActive, [0, 1], [1, 1.4]);
  const backgroundColor = useTransform(isActive, [0, 1], ['hsl(var(--muted))', 'hsl(var(--primary))']);

  return <motion.div className="w-2 h-2 rounded-full cursor-pointer" style={{ scale, backgroundColor }} />;
};

const ProblemSolution = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const totalSubStages = stages.length * 2;

  return (
    <section className="bg-background">
      <div ref={containerRef} className="hidden lg:block relative" style={{ height: `${totalSubStages * 60}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-16 items-center">
              <div className="relative h-[500px]">
                {stages.map((stage, index) => (
                  <StageText key={stage.id} stage={stage} index={index} scrollYProgress={scrollYProgress} totalStages={stages.length} />
                ))}
              </div>
              <div className="relative h-[500px]">
                {stages.map((stage, index) => (
                  <StageImages key={stage.id} stage={stage} index={index} scrollYProgress={scrollYProgress} totalStages={stages.length} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col gap-1">
              <StageIndicator index={index} subIndex={0} scrollYProgress={scrollYProgress} totalStages={stages.length} />
              <StageIndicator index={index} subIndex={1} scrollYProgress={scrollYProgress} totalStages={stages.length} />
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden py-10 sm:py-16">
        <div className="container mx-auto px-6 md:px-8">
          {stages.map((stage) => (
            <motion.div
              key={stage.id}
              className="mb-16 sm:mb-24 last:mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <span className="text-primary font-medium text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4 block">{stage.subtitle}</span>
              <h3 className="text-xl sm:text-3xl font-bold text-foreground leading-tight mb-2 sm:mb-4">{stage.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6">{stage.description}</p>
              {stage.features && (
                <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-8">
                  {stage.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <span className="text-foreground text-xs sm:text-base font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative mb-6 sm:mb-8">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-border/50">
                  <img src={stage.image} alt={`${stage.title} - View 1`} className="w-full h-auto" />
                </div>
              </div>

              <motion.div className="relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-border/50">
                  <img src={stage.image2} alt={`${stage.title} - View 2`} className="w-full h-auto" />
                </div>
              </motion.div>

              {stage.customContent && <div className="mt-6">{stage.customContent}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
