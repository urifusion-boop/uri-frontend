import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  Building,
  Calculator,
  Clock,
  Eye,
  FileText,
  Globe,
  Handshake,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ComponentType } from 'react';

type GuideSection = { title: string; points: string[]; ordered?: boolean };
type GuideStat = { icon: ComponentType<any>; label: string; value: string };
type GuideAction = { label: string; href: string; variant?: 'default' | 'outline' | 'ghost'; icon?: ComponentType<any> };
type GuideBottomCta = { title: string; description: string; buttonText: string; buttonHref: string };
type Guide = {
  title: string;
  type: string;
  description: string;
  readInfo?: string;
  actions?: GuideAction[];
  stats?: GuideStat[];
  sections: GuideSection[];
  bottomCta?: GuideBottomCta;
};

const guidesContent: Record<string, Guide> = {
  'intent-based-selling': {
    title: 'The Ultimate Guide to Intent-Based Selling',
    type: 'PDF Guide',
    description: "A comprehensive guide covering everything from signal identification to closing techniques. Master the art of finding prospects exactly when they're ready to buy.",
    readInfo: '50 pages • 45 min read',
    actions: [
      { label: 'Download PDF', href: '/resources/guides/intent-based-selling', icon: FileText },
      { label: 'Read Online', href: '/resources/guides/intent-based-selling', variant: 'outline' },
    ],
    stats: [
      { icon: Target, label: 'Signal Types', value: '12+' },
      { icon: Users, label: 'Case Studies', value: '8' },
      { icon: MessageSquare, label: 'Templates', value: '15' },
      { icon: TrendingUp, label: 'Avg. ROI Increase', value: '340%' },
    ],
    bottomCta: {
      title: 'Ready to Transform Your Sales?',
      description: 'Download the complete guide and start closing more deals today.',
      buttonText: 'Download Free Guide',
      buttonHref: '/resources/guides/intent-based-selling',
    },
    sections: [
      {
        title: 'Chapter 1: Understanding Intent Signals',
        points: [
          'Learn what buying signals are and why they matter for modern sales teams. Discover the science behind intent detection and how it transforms your outreach strategy.',
          'What are buying signals?',
          'Types of intent indicators',
          'The psychology of purchase decisions',
          'Signal strength vs. noise',
        ],
      },
      {
        title: 'Chapter 2: Identifying High-Value Signals',
        points: [
          'Master the art of recognizing the signals that actually matter. Not all signals are created equal—learn to prioritize the ones that convert.',
          'Direct vs. indirect signals',
          'Contextual signal analysis',
          'Timing and urgency indicators',
          'Company-level vs. individual signals',
        ],
      },
      {
        title: 'Chapter 3: Building Your Signal Framework',
        points: [
          'Create a systematic approach to capturing, scoring, and acting on buying signals across your organization.',
          'Signal scoring methodology',
          'Creating signal playbooks',
          'Team alignment strategies',
          'Technology stack requirements',
        ],
      },
      {
        title: 'Chapter 4: The African Market Context',
        points: [
          'Unique considerations for intent-based selling in African markets, including cultural nuances and platform preferences.',
          'Popular platforms in Africa',
          'Cultural buying patterns',
          'Regional differences',
          'Local language considerations',
        ],
      },
      {
        title: 'Chapter 5: From Signal to Conversation',
        points: [
          'Transform detected signals into meaningful conversations that resonate with prospects and drive conversions.',
          'Personalization at scale',
          'Timing your outreach',
          'Multi-channel approaches',
          'Message crafting techniques',
        ],
      },
      {
        title: 'Chapter 6: Measuring Success',
        points: [
          'Track the right metrics to understand the impact of intent-based selling on your revenue and pipeline.',
          'Key performance indicators',
          'Attribution models',
          'ROI calculation',
          'Continuous improvement loops',
        ],
      },
    ],
  },
  'african-b2b-sales': {
    title: 'African B2B Sales Playbook',
    type: 'PDF Guide',
    description:
      "Strategies and tactics specifically designed for selling to businesses across Africa. Navigate cultural nuances, regional differences, and unlock the continent's massive B2B potential.",
    readInfo: '35 pages • 30 min read',
    actions: [
      { label: 'Download PDF', href: '/resources/guides/african-b2b-sales', icon: FileText },
      { label: 'Read Online', href: '/resources/guides/african-b2b-sales', variant: 'outline' },
    ],
    stats: [
      { icon: MapPin, label: 'Countries Covered', value: '20+' },
      { icon: Building, label: 'Industry Insights', value: '12' },
      { icon: Handshake, label: 'Case Studies', value: '6' },
      { icon: Globe, label: 'Languages', value: '4' },
    ],
    bottomCta: {
      title: 'Expand Across Africa',
      description: "Get the complete playbook for B2B success in Africa's fastest-growing markets.",
      buttonText: 'Download Free Playbook',
      buttonHref: '/resources/guides/african-b2b-sales',
    },
    sections: [
      {
        title: 'West Africa',
        points: [
          "Countries: Nigeria, Ghana, Senegal, Côte d'Ivoire",
          'Focus on relationship-building and face-to-face meetings. WhatsApp is the dominant communication channel. Decision-making often involves multiple stakeholders.',
        ],
      },
      {
        title: 'East Africa',
        points: ['Countries: Kenya, Tanzania, Uganda, Rwanda', 'Mobile-first market with strong fintech adoption. LinkedIn is gaining traction for B2B. English and Swahili content performs well.'],
      },
      {
        title: 'Southern Africa',
        points: ['Countries: South Africa, Botswana, Namibia, Zimbabwe', 'More mature B2B landscape with established procurement processes. Email remains important. Formal proposals expected.'],
      },
      {
        title: 'North Africa',
        points: ['Countries: Egypt, Morocco, Tunisia, Algeria', 'Arabic and French content essential. Strong preference for local partnerships. Government contracts significant in many sectors.'],
      },
      {
        title: 'Understanding African Business Culture',
        points: ['The importance of trust and relationships', 'Navigating formal vs. informal sectors', 'Religious and cultural considerations', 'Holiday and business cycle timing'],
      },
      {
        title: 'Market Entry Strategies',
        points: ['Direct sales vs. partnerships', 'Local representation requirements', 'Regulatory landscapes by country', 'Payment and currency challenges'],
      },
      {
        title: 'Digital Sales Channels',
        points: ['WhatsApp Business strategies', 'LinkedIn in Africa', 'Twitter/X for B2B engagement', 'Local platforms and forums'],
      },
      {
        title: 'Pricing and Negotiation',
        points: ['Currency considerations', 'Payment terms expectations', 'Negotiation styles by region', 'Bundling and value-based pricing'],
      },
      {
        title: 'Building Long-term Relationships',
        points: ['After-sales service expectations', 'Referral culture in Africa', 'Managing multi-country accounts', 'Cross-border expansion strategies'],
      },
    ],
  },
  'crm-integration': {
    title: 'CRM Integration Best Practices',
    type: 'Technical Guide',
    description: 'Step-by-step instructions for connecting URI with Salesforce, HubSpot, and Pipedrive. Get your integrations running smoothly in minutes.',
    readInfo: '20 pages • 15 min read',
    actions: [
      { label: 'Download PDF', href: '/resources/guides/crm-integration', icon: FileText },
      { label: 'View Integrations', href: '/resources/help-center/crm-integration', variant: 'outline' },
    ],
    stats: [
      { icon: Settings, label: 'CRMs Supported', value: '3' },
      { icon: Zap, label: 'Avg. Setup Time', value: '5 min' },
      { icon: Shield, label: 'Security', value: 'OAuth 2.0' },
      { icon: RefreshCw, label: 'Sync Type', value: 'Real-time' },
    ],
    bottomCta: {
      title: 'Need Help?',
      description: 'Our team is available to help you set up your CRM integration.',
      buttonText: 'Contact Support',
      buttonHref: '/company/contact',
    },
    sections: [
      {
        title: 'Salesforce Integration',
        ordered: true,
        points: [
          'Navigate to Settings > Integrations in URI',
          "Click 'Connect Salesforce' and log in with admin credentials",
          'Grant URI permission to access your Salesforce data',
          'Select which objects to sync (Leads, Contacts, Accounts, Opportunities)',
          'Configure field mappings for custom fields',
          'Set sync frequency (real-time recommended)',
          'Enable bi-directional sync for lead updates',
        ],
      },
      {
        title: 'HubSpot Integration',
        ordered: true,
        points: [
          'Go to URI Settings > Integrations',
          "Select 'Connect HubSpot' and authenticate",
          'Choose your HubSpot portal if you have multiple',
          'Select contact properties to sync',
          'Map URI signal fields to HubSpot properties',
          'Configure deal creation rules for high-intent signals',
          'Set up workflow triggers for new signals',
        ],
      },
      {
        title: 'Pipedrive Integration',
        ordered: true,
        points: [
          'Access URI Settings > Integrations',
          "Click 'Connect Pipedrive' and enter your API token",
          'Select pipeline and stage mappings',
          'Configure person and organization sync',
          'Set up activity creation for detected signals',
          'Enable automatic deal updates',
          'Configure notification preferences',
        ],
      },
      {
        title: 'Best Practices',
        points: [
          'Data Hygiene: Clean your CRM data before connecting. Remove duplicates and standardize field formats for optimal sync performance.',
          'Field Mapping Strategy: Create custom fields in your CRM specifically for URI signal data. This keeps your existing workflows intact.',
          'Sync Monitoring: Regularly check the sync status dashboard. Address any failed syncs promptly to maintain data accuracy.',
          'Team Training: Train your sales team on how URI signals appear in the CRM and how to act on them effectively.',
        ],
      },
    ],
  },
  'lead-scoring-template': {
    title: 'Lead Scoring Framework Template',
    type: 'Template',
    description: 'A ready-to-use spreadsheet template for scoring leads based on intent signals. Prioritize your outreach and focus on the leads most likely to convert.',
    readInfo: 'Excel/Sheets • Customizable',
    actions: [
      { label: 'Download Excel', href: '/resources/guides/lead-scoring-template', icon: FileText },
      { label: 'Open in Google Sheets', href: '/company/contact', variant: 'outline' },
    ],
    stats: [
      { icon: Calculator, label: 'Scoring Factors', value: '20+' },
      { icon: Target, label: 'Lead Tiers', value: '4' },
      { icon: TrendingUp, label: 'Conversion Lift', value: '2.5x' },
      { icon: BarChart3, label: 'Auto-Calculations', value: 'Yes' },
    ],
    bottomCta: {
      title: 'Automate Your Lead Scoring',
      description: 'URI automatically scores leads based on these criteria. Start your free trial today.',
      buttonText: 'Start Free Trial',
      buttonHref: '/pricing',
    },
    sections: [
      {
        title: 'Scoring Criteria: Signal Strength (40%)',
        points: ['Direct purchase intent — 25 pts', 'Problem/pain expression — 20 pts', 'Recommendation request — 18 pts', 'Competitor mention — 15 pts', 'Industry event mention — 10 pts'],
      },
      {
        title: 'Scoring Criteria: Company Fit (30%)',
        points: ['Target industry match — 20 pts', 'Company size (employees) — 15 pts', 'Revenue range fit — 15 pts', 'Geographic location — 10 pts', 'Technology stack match — 10 pts'],
      },
      {
        title: 'Scoring Criteria: Engagement Level (20%)',
        points: ['Multiple signals in 7 days — 15 pts', 'Visited website — 10 pts', 'Downloaded content — 10 pts', 'Email engagement — 8 pts', 'Social media interaction — 5 pts'],
      },
      {
        title: 'Scoring Criteria: Timing & Urgency (10%)',
        points: ['Explicit timeline mentioned — 15 pts', 'Budget confirmed — 12 pts', 'Decision-maker identified — 10 pts', 'Competitor deadline — 8 pts', 'Seasonal relevance — 5 pts'],
      },
      {
        title: 'Lead Tiers & Actions',
        points: [
          'Hot Lead — 80-100 pts — Immediate outreach within 24 hours',
          'Warm Lead — 60-79 pts — Personalized email sequence within 48 hours',
          'Qualified Lead — 40-59 pts — Add to nurture campaign, monitor for signals',
          'Cold Lead — Below 40 pts — Long-term nurture, re-evaluate quarterly',
        ],
      },
    ],
  },
  'ndpr-checklist': {
    title: 'NDPR Compliance Checklist',
    type: 'Checklist',
    description: 'Ensure your sales processes comply with Nigeria Data Protection Regulation. A comprehensive checklist for maintaining NDPR compliance in your organization.',
    readInfo: '10 pages • Interactive',
    actions: [
      { label: 'Download PDF', href: '/resources/guides/ndpr-checklist', icon: FileText },
      { label: 'NDPR Details', href: '/privacy-policy', variant: 'outline' },
    ],
    stats: [
      { icon: Shield, label: 'Checklist Items', value: '36' },
      { icon: Lock, label: 'Security Tasks', value: '12' },
      { icon: Eye, label: 'Privacy Tasks', value: '14' },
      { icon: UserCheck, label: 'Rights Tasks', value: '10' },
    ],
    bottomCta: {
      title: 'Questions About Compliance?',
      description: 'Our team can help you understand how URI maintains NDPR compliance.',
      buttonText: 'Contact Our Team',
      buttonHref: '/company/contact',
    },
    sections: [
      {
        title: 'Data Collection & Consent',
        points: [
          'Obtain explicit consent before collecting personal data (Required)',
          'Clearly state the purpose of data collection (Required)',
          'Provide opt-out mechanisms for marketing communications (Required)',
          'Document consent records with timestamps (Required)',
          'Implement age verification for applicable services',
          'Use layered privacy notices for complex processing',
        ],
      },
      {
        title: 'Data Storage & Security',
        points: [
          'Encrypt personal data at rest and in transit (Required)',
          'Implement access controls based on role (Required)',
          'Maintain audit logs for data access (Required)',
          'Store data on servers within Nigeria or approved jurisdictions (Required)',
          'Conduct regular security assessments (Required)',
          'Establish incident response procedures (Required)',
        ],
      },
      {
        title: 'Data Subject Rights',
        points: [
          'Provide mechanism for data access requests (Required)',
          'Enable data portability in machine-readable format (Required)',
          'Implement data deletion/right to be forgotten (Required)',
          'Allow data rectification and updates (Required)',
          'Process requests within 30 days (Required)',
          'Document all data subject requests and responses (Required)',
        ],
      },
      {
        title: 'Third-Party Management',
        points: [
          'Maintain register of all data processors (Required)',
          'Execute Data Processing Agreements (DPAs) (Required)',
          'Conduct due diligence on processor security (Required)',
          'Ensure cross-border transfers have adequate safeguards (Required)',
          'Review processor compliance annually',
          'Include audit rights in processor contracts',
        ],
      },
      {
        title: 'Organizational Measures',
        points: [
          'Appoint a Data Protection Officer (if required) (Required)',
          'Register with NITDA if processing significant personal data (Required)',
          'Conduct Data Protection Impact Assessments (Required)',
          'Train employees on data protection practices (Required)',
          'Maintain records of processing activities (Required)',
          'Review and update privacy policy annually (Required)',
        ],
      },
      {
        title: 'How URI Helps with Compliance',
        points: [
          'All data encrypted at rest and in transit',
          'Automated consent management',
          'Built-in data subject request handling',
          'NITDA registered and compliant',
          'Regular security audits',
          'Data Processing Agreements available',
        ],
      },
    ],
  },
  'signal-to-sale': {
    title: 'Signal-to-Sale Conversion Guide',
    type: 'PDF Guide',
    description: 'How to turn buying signals into closed deals with personalized outreach strategies. Learn the exact framework top sellers use to convert intent into revenue.',
    readInfo: '25 pages • 20 min read',
    actions: [
      { label: 'Download PDF', href: '/resources/guides/signal-to-sale', icon: FileText },
      { label: 'Get Templates', href: '/company/contact', variant: 'outline' },
    ],
    stats: [
      { icon: MessageSquare, label: 'Message Templates', value: '12' },
      { icon: Mail, label: 'Email Sequences', value: '4' },
      { icon: Phone, label: 'Call Scripts', value: '6' },
      { icon: Send, label: 'Avg. Response Rate', value: '34%' },
    ],
    bottomCta: {
      title: 'Let Dera AI Write Your Outreach',
      description: "URI's Dera AI automatically crafts personalized messages based on each signal.",
      buttonText: 'Try Dera AI Free',
      buttonHref: '/pricing',
    },
    sections: [
      {
        title: 'Signal Detection (0-1 hour)',
        points: [
          'Capture the signal and understand the context',
          'Review the full context of the signal',
          'Identify the specific pain point or need',
          'Research the prospect and their company',
          'Determine the urgency level',
        ],
      },
      {
        title: 'Personalization (1-4 hours)',
        points: [
          'Craft a message that resonates with their specific situation',
          'Reference their specific post or comment',
          'Connect their need to your solution',
          'Prepare relevant case studies or proof points',
          'Choose the right channel for outreach',
        ],
      },
      {
        title: 'Initial Outreach (4-24 hours)',
        points: [
          'Make first contact while the signal is still fresh',
          'Send personalized message via preferred channel',
          'Offer immediate value (insight, resource, introduction)',
          'Ask a thoughtful question to start dialogue',
          'Keep it brief and focused on them',
        ],
      },
      {
        title: 'Follow-up Sequence (2-14 days)',
        points: [
          'Nurture the relationship with value-added touches',
          'Day 3: Share relevant content or case study',
          'Day 7: Offer a quick call or demo',
          'Day 10: Provide social proof or testimonial',
          'Day 14: Make a direct ask or offer',
        ],
      },
      {
        title: 'Conversion (14-30 days)',
        points: [
          'Move from prospect to customer',
          'Present tailored solution and pricing',
          'Address objections with signal-specific responses',
          'Offer trial or pilot if appropriate',
          'Close and onboard smoothly',
        ],
      },
      {
        title: 'Outreach Templates',
        points: [
          "LinkedIn Connection\nHi [Name], I noticed your post about [specific topic]. At [Your Company], we've helped similar businesses [specific benefit]. Would love to connect and share some insights that might be helpful.",
          'Email Outreach\nSubject: Re: Your [topic] question\n\nHi [Name],\n\nI saw your recent post about [specific challenge]. This is exactly what [your solution] was built to solve.\n\n[Specific result from similar client] achieved [specific outcome] in just [timeframe].\n\nWould a 15-minute call this week be helpful to explore if we could do the same for you?\n\n[Your name]',
          "Twitter/X DM\nHey [Name]! Saw your tweet about [topic]. We've helped [number] companies solve exactly that. Here's a quick case study: [link]. Happy to chat if useful!",
          "WhatsApp Message\nHi [Name], this is [Your Name] from [Company]. I came across your post about [topic] and thought our solution might help. We've helped [similar company] achieve [result]. Would you be open to a quick chat?",
        ],
      },
    ],
  },
};

export default function GuideDetailPage() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const data = slug ? guidesContent[slug] : undefined;

  return (
    <>
      <SeoHead title={data ? data.title : 'Guide'} />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/guides" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides
            </Link>
            {data ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{data.type}</span>
                  {data.readInfo && (
                    <span className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {data.readInfo}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
                <p className="text-lg text-muted-foreground mb-8">{data.description}</p>
                {data.actions && (
                  <div className="flex flex-wrap gap-4 mb-12">
                    {data.actions.map((action) => (
                      <Button key={action.label} size="lg" className="rounded-full" variant={action.variant ?? 'default'} asChild>
                        <Link href={action.href}>
                          {action.icon ? <action.icon className="w-4 h-4 mr-2" /> : null}
                          {action.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6">Guide not found.</div>
            )}
          </motion.div>

          {data?.stats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid md:grid-cols-4 gap-6 mb-16">
              {data.stats.map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
              {data.sections.map((section) => (
                <div key={section.title} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                  {section.ordered ? (
                    <ol className="space-y-3">
                      {section.points.map((step, index) => (
                        <li key={step} className="flex items-start">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">{index + 1}</span>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {section.points.map((p) => (
                        <li key={p}>{p.includes('\n') ? <pre className="whitespace-pre-wrap font-sans">{p}</pre> : p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {data?.bottomCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 text-center mt-16"
            >
              <h2 className="text-2xl font-bold mb-4">{data.bottomCta.title}</h2>
              <p className="text-muted-foreground mb-6">{data.bottomCta.description}</p>
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href={data.bottomCta.buttonHref}>{data.bottomCta.buttonText}</Link>
              </Button>
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
