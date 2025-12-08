import { ClimberIcon, PersonalGrowthIcon, WebAnalyticsIcon } from '@/components/atoms/Icons';
import SeoHead from '@/components/atoms/SeoHead';
import FeatureCard from '@/components/landing/FeatureCard';
import FeatureParentComponent from '@/components/landing/FeatureParentComponent';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

const connectCardData = [
  {
    icon: <ClimberIcon />,
    title: 'Tracking audience sentiment',
    description: 'Capture real-time feedback on shows, events, or campaigns through keyword tracking to understand audience preferences.',
  },
  {
    icon: <WebAnalyticsIcon />,
    title: 'Enhancing fan engagement',
    description: 'Use account tracking to analyze fan interactions and foster stronger connections.',
  },
  {
    icon: <PersonalGrowthIcon />,
    title: 'Simplifying content scheduling',
    description: 'Plan and post updates using content management tools for consistent communication.',
  },
  {
    icon: <PersonalGrowthIcon />,
    title: 'Identifying Collaboration Opportunities',
    description: 'Discover potential partnerships or sponsorships through lead tracking.',
  },
];

function Index() {
  return (
    <>
      <SeoHead title="For Media and Entertainment" />
      <div className="bg-[#FFF]">
        <Navigation />
        <div className="container">
          <FeatureParentComponent className="items-center md:my-[60px]">
            <FeatureCard
              showFeaturesList={false}
              h1="Elevating"
              h1tinted=" Media"
              h1middle=" and"
              h2=" Entertainment"
              h2tinted=" Brands"
              description="Stay in the spotlight with Uri, the ultimate tool for media and entertainment brands to track trends, understand audience sentiment, and uncover fresh engagement opportunities. "
            />
            <Image alt="" src={'/assets/images/elevating-media-features.png'} width={669} height={580} className="h-full object-contain flex-1" />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center flex-col-reverse">
            <Image alt="" src={'/assets/images/what-uri-does-startup.png'} width={669} height={580} className="h-full object-contain flex-1" />
            <FeatureCard
              showFeaturesList={false}
              h1="What"
              h1tinted=" Uri"
              h1middle=" Does for Media"
              h2middle="and Entertainment"
              description="Keep your brand center stage with Uri’s powerful insights. Monitor audience sentiment in real time to gauge how your content resonates and adapt quickly to trends."
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center">
            <FeatureCard showFeatureTitle={false} showFeaturesList={true} h1="Key" h1tinted=" Features" h1middle=" Just For You" data={connectCardData} />
            <Image alt="" src={'/assets/images/media-key-features.png'} width={669} height={580} className="h-full object-contain flex-1" />
          </FeatureParentComponent>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Index;
