import { ClimberIcon, PersonalGrowthIcon } from '@/components/atoms/Icons';
import SeoHead from '@/components/atoms/SeoHead';
import FeatureCard from '@/components/landing/FeatureCard';
import FeatureParentComponent from '@/components/landing/FeatureParentComponent';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import Image from 'next/image';

const connectCardData = [
  {
    icon: <ClimberIcon />,
    title: 'Understanding the markets',
    description: 'Use keyword tracking to identify industry trends, customer needs, and competitor activities for strategic positioning.',
  },
  {
    icon: <PersonalGrowthIcon />,
    title: 'Simplifying content creation',
    description: 'Employ content management tools to create and schedule posts, ensuring startups stay active and relevant.',
  },
  {
    icon: <PersonalGrowthIcon />,
    title: 'Accelerating customer acquisition',
    description: 'Utilize lead tracking to identify potential customers or partners, driving growth efficiently.',
  },
];

function Index() {
  return (
    <>
      <SeoHead title="For Startups" />
      <div className="bg-[#FFF]">
        <Navigation />
        <div className="container">
          <FeatureParentComponent className="items-center md:my-[60px]">
            <FeatureCard
              showFeaturesList={false}
              h1="Fueling"
              h1tinted=" Startup"
              h1middle=" Growth"
              description="Take your startup to the next level with Uri, the ultimate toolkit for understanding your audience, outpacing competitors, and managing your online presence—all while staying laser-focused on growth and agility. "
            />
            <Image alt="" src={'/assets/images/driving-data.png'} width={669} height={622} className="object-contain flex-1" />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center flex-col-reverse">
            <Image alt="" src={'/assets/images/what-uri-does-startup.png'} width={669} height={622} className="object-contain flex-1" />
            <FeatureCard
              showFeaturesList={false}
              h1="What"
              h1tinted=" Uri"
              h1middle=" Does for Startups"
              description="Fuel your startup’s success with Uri’s game-changing insights. From market fit analysis to uncover what excites your audience to lead generation and scoring that pinpoints high-interest prospects, Uri ensures you’re always one step ahead in driving conversions and refining your offerings."
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center">
            <FeatureCard showFeatureTitle={false} showFeaturesList={true} h1="Key" h1tinted=" Features" h1middle=" Just For You" data={connectCardData} />
            <Image alt="" src={'/assets/images/startup-key-features.png'} width={669} height={622} className="h-full object-contain flex-1" />
          </FeatureParentComponent>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Index;
