import { WeeklyCampaignCalendar } from "@/models/dtos/AIKeywordConversationInsights";

export const campaigns: WeeklyCampaignCalendar[] = [
  {
    topic: "Empowerment through Funding",
    title: "Unlocking Opportunities with LSETF",
    post: "Join us for a session on accessing loans and grants for your business.",
    media_type: "video",
    day_of_the_week: "Thursday",
    post_time: "11:30 AM",
    hashtags: ["#LSETF", "#Empowerment"],
    mentions: ["@LSETF"],
    target_audience_countries: ["Nigeria"],
    post_justificatio:
      "This topic resonates with ongoing discussions about funding access and aligns with the upcoming event.",
  },
  {
    topic: "Skill Acquisition Programs",
    title: "Empowering Youth through Training",
    post: "Discover training opportunities available through LSETF to boost your career prospects.",
    media_type: "image",
    day_of_the_week: "Monday",
    post_time: "10:00 AM",
    hashtags: ["#YouthEmpowerment", "#SkillAcquisition"],
    mentions: ["@LSETF"],
    target_audience_countries: ["Nigeria"],
    post_justificatio:
      "This aligns with the recurring theme of youth empowerment and skill acquisition observed in the tweets.",
  },
  {
    topic: "Community Engagement",
    title: "Your Voice Matters!",
    post: "Have questions about LSETF programs? Join our Q&A session this Friday!",
    media_type: "live video",
    day_of_the_week: "Friday",
    post_time: "2:00 PM",
    hashtags: ["#LSETF", "#CommunityEngagement"],
    mentions: ["@LSETF"],
    target_audience_countries: ["Nigeria"],
    post_justificatio:
      "Engaging directly with the community addresses queries and promotes transparency.",
  },
  {
    topic: "Training Events",
    title: "Join Us for Our Training Day!",
    post: "Learn how to navigate the LSETF funding process at our upcoming training event.",
    media_type: "infographic",
    day_of_the_week: "Wednesday",
    post_time: "1:00 PM",
    hashtags: ["#TrainingDay", "#LSETF"],
    mentions: ["@LSETF"],
    target_audience_countries: ["Nigeria"],
    post_justificatio:
      "This post is relevant as it promotes the training event that is already generating interest in the tweets.",
  },
  {
    topic: "Feedback and Support",
    title: "We Want to Hear from You!",
    post: "Share your experiences with LSETF programs and how we can improve.",
    media_type: "text post",
    day_of_the_week: "Tuesday",
    post_time: "3:00 PM",
    hashtags: ["#Feedback", "#LSETF"],
    mentions: ["@LSETF"],
    target_audience_countries: ["Nigeria"],
    post_justificatio:
      "Encouraging feedback can foster community trust and improve future initiatives.",
  },

  // Add more campaigns here
];

export const contentThemesData = [
  { theme: "Access to funding", mentions: 7 },
  { theme: "Training and skill acquisition", mentions: 4 },
  { theme: "Community engagement", mentions: 3 },
];

export const totalContentThemesMentions = contentThemesData.reduce(
  (acc, theme) => acc + theme.mentions,
  0
);

export const keyTrends = [
  "Empowerment initiatives",
  "Training programs",
  "Loan and grant access",
];

export const recommendations = [
  "Increase outreach through social media",
  "Host more live events for direct engagement",
  "Create informative content about loan processes",
];

export const engagementDrivers = [
  "Information sharing",
  "Event promotion",
  "Direct interaction with stakeholders",
];

export const engagementOpportunities = [
  "Utilize visual content for training events",
  "Engage with users asking questions",
  "Highlight successful beneficiaries",
];

export const emotionalTones = [
  { tone: "neutral", score: 0.5 },
  { tone: "positive", score: 0.4 },
  { tone: "negative", score: 0.1 },
];
