import Image from 'next/image';
import { AreaChartIcon, BotIcon, BusinessIcon, ClimberIcon, PersonalGrowthIcon, SchedulingIcon, SmilingFaceIcon, WebAnalyticsIcon } from '../atoms/Icons';

import { LightThemeColors } from '@/configs/colors.config';
import ArrowTrendingFilled from '@/utils/icon/ArrowTrendingFilled';
import { AiFillAlert } from 'react-icons/ai';
import { BsChatTextFill } from 'react-icons/bs';
import { FaHashtag } from 'react-icons/fa6';
import ContentFill from '../../../public/assets/icons/content-view-fill.svg';
import FeatureCard from './FeatureCard';
import FeatureParentComponent from './FeatureParentComponent';

const sentimentCardData = [
  {
    icon: <AreaChartIcon />,
    title: 'Track trends',
    description: 'Monitor keyword activity across social platforms to spot emerging trends in real time.',
  },
  {
    icon: <SmilingFaceIcon />,
    title: 'Analyze sentiment',
    description: 'Evaluate the sentiment around your keywords to understand audience reactions.',
  },
  {
    icon: (
      <AiFillAlert
        style={{
          height: '25px',
          width: '25px',
        }}
        color={LightThemeColors.uriColor}
      />
    ),
    title: 'Setup Alert',
    description: 'Receive notifications when your chosen keywords are mentioned.',
  },
];

const connectCardData = [
  {
    icon: <BusinessIcon />,
    title: 'Connect and post',
    description: 'Easily link your social media profiles to our platform and begin posting content directly.',
  },
  {
    icon: <BotIcon />,
    title: 'AI-Driven content',
    description: 'Enhance your content creation process, from generating ideas to refining posts.',
  },
  {
    icon: <SchedulingIcon />,
    title: 'Content Scheduling',
    description: 'Plan and schedule your posts in advance across all your connected social media platforms.',
  },
];

const leadCardData = [
  {
    icon: <BusinessIcon />,
    title: 'Find your perfect audience',
    description: 'Identify people actively looking for what you offer. Connect with the right customers effortlessly.',
  },
  {
    icon: <BotIcon />,
    title: 'Always-On prospecting',
    description: 'Our tool works 24/7, delivering fresh, qualified leads to grow your business every day. ',
  },
  {
    icon: <SchedulingIcon />,
    title: 'Close deals faster',
    description: 'Focus on warm, ready-to-convert leads instead of wasting time chasing cold prospects.',
  },
];

const engagementData = [
  {
    icon: <ClimberIcon />,
    title: 'Identify top posts',
    description: 'Track the most engaging posts from specific accounts to inspire your own content strategy.',
  },
  {
    icon: <WebAnalyticsIcon />,
    title: 'Sentiment analysis',
    description: 'Understand the emotions behind the engagement and interactions.',
  },
  {
    icon: <PersonalGrowthIcon />,
    title: 'Performance Enhancement',
    description: 'Receive recommendations on how to improve account engagement and content strategy.',
  },
];

const askDeraAiData = [
  {
    icon: <BsChatTextFill size={26} color={LightThemeColors.uriColor} />,
    title: 'Chat with Dera AI',
    description: 'Simply start a conversation and explore your tracked data effortlessly.',
  },
  {
    icon: <WebAnalyticsIcon />,
    title: 'Select & Analyze Your Data',
    description: 'Select the specific data you want to discuss, and Dera AI will break it down for you.',
  },
  {
    icon: (
      <ArrowTrendingFilled
        style={{
          height: '28px',
          width: '28px',
        }}
      />
    ),
    title: 'Take Action & Optimize',
    description: 'Ask for summaries, trends, or action items based on your data.',
  },
];

const hashtagData = [
  {
    icon: (
      <FaHashtag
        style={{
          height: '28px',
          width: '28px',
        }}
        color={LightThemeColors.uriColor}
      />
    ),
    title: 'Monitor Overall Impact',
    description: 'Get a clear overview of your hashtag performance across social media.',
  },
  {
    icon: <ContentFill />,
    title: 'Discover Hashtag Influence',
    description: 'Easily access all posts that use your hashtags to see how people are responding. ',
  },
  {
    icon: <BotIcon />,
    title: 'Get AI-Powered Reports',
    description: 'Receive AI-powered reports with insights and recommendations to improve your hashtag strategy.',
  },
];

export const LandingFeatures = () => {
  return (
    <div className="mx-4">
      <FeatureParentComponent id="keyword-tracking">
        <FeatureCard h1={'Monitor the'} h1tinted="Trends." h2="Capture" h2middle="the Conversation" data={sentimentCardData} />
        <Image alt="" src={'/assets/images/sentiment-feature.png'} width={669} height={622} className="h-full object-contain flex-1" />
      </FeatureParentComponent>
      <FeatureParentComponent className="flex-col-reverse" id="lead-tracking">
        <Image alt="" src={'/assets/images/lead-feature.png'} width={669} height={622} className="h-full object-contain flex-1" />
        <FeatureCard h1="Turn" h1tinted=" Leads" h1middle=" into" h2="Customers" showFeatureTitle={false} data={leadCardData} />
      </FeatureParentComponent>
      <FeatureParentComponent id="content-management">
        <FeatureCard showFeatureTitle={false} h1="Streamline your" h1tinted=" Content" h2="Management" data={connectCardData} />
        <Image alt="" src={'/assets/images/connect-feature.png'} width={669} height={622} className="h-full object-contain flex-1" />
      </FeatureParentComponent>
      <FeatureParentComponent className="flex-col-reverse" id="account-tracking">
        <Image alt="" src={'/assets/images/engagement-feature.png'} width={669} height={622} className="h-full object-contain flex-1" />
        <FeatureCard showFeatureTitle={false} h1="Stay in Control with" h2="Account Tracking" data={engagementData} />
      </FeatureParentComponent>
      <FeatureParentComponent id="hashtag-tracking">
        <FeatureCard showFeatureTitle={false} h1="Track Your" h1tinted=" Hashtag" h2middle="Performance" data={hashtagData} />
        <Image alt="" src={'/assets/images/hashtag-tracking.png'} width={669} height={622} className="h-full object-contain flex-1" />
      </FeatureParentComponent>
      <FeatureParentComponent className="flex-col-reverse" id="insight-assistant">
        <Image alt="" src={'/assets/images/ask-dera-ai.png'} width={669} height={622} className="h-full object-contain flex-1" />
        <FeatureCard showFeatureTitle={false} h1="Simply Ask" h1tinted=" Dera AI" data={askDeraAiData} />
      </FeatureParentComponent>
    </div>
  );
};
