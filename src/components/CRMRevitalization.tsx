import akinAvatar from '@/assets/akin-johnson-avatar.png';
import hubspotLogo from '@/assets/logos/hubspot.svg';
import pipedriveLogo from '@/assets/logos/pipedrive.svg';
import salesforceLogo from '@/assets/logos/salesforce.svg';
import slackLogo from '@/assets/logos/slack.svg';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, Eye, Plug, Zap } from 'lucide-react';
const uriLogo = '/assets/images/landing/logo.png';

const integrations = [
  { name: 'Salesforce', logo: salesforceLogo, bgColor: 'bg-white' },
  { name: 'HubSpot', logo: hubspotLogo, bgColor: 'bg-white' },
  { name: 'Pipedrive', logo: pipedriveLogo, bgColor: 'bg-[#28292B]' },
  { name: 'Slack', logo: slackLogo, bgColor: 'bg-white' },
];

const CRMRevitalization = () => {
  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Unified Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Turn Your 'Closed-Lost' into 'Closed-Won'</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Connect your CRM. We'll watch your dead leads and alert you the moment they're ready to buy again.</p>
        </motion.div>

        {/* Three-Step Flow */}
        <div className="max-w-6xl mx-auto">
          {/* Step Indicators */}
          <div className="hidden md:flex items-center justify-center gap-4 mb-12">
            {[
              { num: 1, label: 'Connect' },
              { num: 2, label: 'Monitor' },
              { num: 3, label: 'Alert' },
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{step.num}</div>
                  <span className="font-medium text-sm">{step.label}</span>
                </div>
                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.3, duration: 0.5 }}
                    className="w-24 lg:w-32 h-0.5 bg-primary/30 mx-4 origin-left"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Connect Your Tools */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                <Plug className="w-4 h-4" />
                Step 1
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">Connect Your CRM</h3>
              <p className="text-muted-foreground">Sync with Salesforce, HubSpot, Pipedrive & more in seconds. Your dead leads are just sitting there—let's put them to work.</p>
            </div>

            {/* Integration Logos flowing into URI */}
            <div className="relative h-[200px] sm:h-[250px]">
              <div className="flex items-center justify-center h-full">
                {/* Integration logos on left */}
                <div className="flex flex-col gap-3">
                  {integrations.map((integration, index) => (
                    <motion.div
                      key={integration.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`${integration.bgColor} p-2.5 rounded-xl shadow-md border border-border/50`}
                    >
                      {(() => {
                        const Logo = integration.logo as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                        return <Logo className="w-8 h-8" aria-label={integration.name} />;
                      })()}
                    </motion.div>
                  ))}
                </div>

                {/* Animated connection lines */}
                <div className="relative w-32 sm:w-48 h-full flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.line
                        key={i}
                        x1="0"
                        y1={50 + i * 50}
                        x2="100%"
                        y2="125"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="6,6"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.5 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      />
                    ))}
                  </svg>
                  {/* Animated dots traveling along lines */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={`dot-${i}`}
                      className="absolute w-2 h-2 bg-primary rounded-full"
                      style={{ left: 0, top: 50 + i * 50 }}
                      animate={{
                        x: [0, 120, 0],
                        y: [0, 75 - i * 50, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  ))}
                </div>

                {/* URI Hub */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg p-2"
                >
                  <img src={uriLogo} alt="URI" className="w-full h-full object-contain" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Step 2: We Monitor Dead Leads */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
            {/* CRM Table Visual */}
            <div className="order-2 md:order-1">
              <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
                <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Your Dead Leads</span>
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="ml-auto text-xs text-primary font-medium">
                    URI Monitoring...
                  </motion.span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-2.5 font-semibold">Lead</th>
                        <th className="text-left p-2.5 font-semibold">Status</th>
                        <th className="text-left p-2.5 font-semibold">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Tech Corp A', days: '90 days ago' },
                        { name: 'Startup B', days: '120 days ago' },
                        { name: 'Agency C', days: '60 days ago' },
                      ].map((lead, index) => (
                        <motion.tr
                          key={lead.name}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.4 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="border-b border-border"
                        >
                          <td className="p-2.5">{lead.name}</td>
                          <td className="p-2.5">
                            <span className="text-xs px-2 py-0.5 rounded bg-muted">Closed-Lost</span>
                          </td>
                          <td className="p-2.5 text-muted-foreground">{lead.days}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Scanning indicator */}
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                <Eye className="w-4 h-4" />
                Step 2
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">We Monitor Your Dead Leads</h3>
              <p className="text-muted-foreground">URI continuously scans social media, job boards, and news for your old leads. We're watching while you focus on closing deals.</p>
            </div>
          </motion.div>

          {/* Step 3: Get Alerted on New Intent */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Step 3
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">Get Alerted When They're Ready</h3>
              <p className="text-muted-foreground">The moment a dead lead shows buying signals, you get notified instantly. Strike while the iron is hot.</p>

              <Button className="mt-4 group">
                Start Reviving Leads
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Alert Notification Visual */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl border-2 border-primary shadow-lg overflow-hidden"
              >
                {/* Alert Header */}
                <div className="bg-primary/10 p-3 border-b border-primary/20 flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Bell className="w-5 h-5 text-primary" />
                  </motion.div>
                  <span className="font-semibold text-primary">Intent Signal Detected!</span>
                </div>

                {/* Alert Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={akinAvatar.src} alt="Akin Johnson" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">Akin Johnson</p>
                      <p className="text-xs text-muted-foreground">FinTech Co • Previously Closed-Lost</p>
                    </div>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold"
                    >
                      New Intent
                    </motion.span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground italic">"Evaluating new payment infrastructure solutions for Q2 expansion."</p>
                    <p className="text-xs text-muted-foreground mt-2">Posted on LinkedIn • 2 min ago</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Reach Out Now
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Decorative ping animation */}
              <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CRMRevitalization;
