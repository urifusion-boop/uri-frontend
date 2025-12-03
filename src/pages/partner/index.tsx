import { ApplicationIcon, ApprovedIcon, PersonalGrowthIcon } from '@/components/atoms/Icons';
import SeoHead from '@/components/atoms/SeoHead';
import FeatureCard from '@/components/landing/FeatureCard';
import FeatureParentComponent from '@/components/landing/FeatureParentComponent';
import Footer from '@/components/landing/Footer';
import PartnerProgramOptions from '@/components/landing/PartnerProgramOptions';
import Partners from '@/components/landing/Partners';
import WhyPartner from '@/components/landing/WhyPartner';
import Navigation from '@/components/Navigation';
import { Box } from '@mui/material';
import Image from 'next/image';

const partnerCardData = [
  {
    icon: <ApplicationIcon />,
    title: 'Fill out the application',
    description: 'Focus on warm, ready-to-convert leads instead of wasting time chasing cold prospects.',
  },
  {
    icon: <ApprovedIcon />,
    title: 'Get approved',
    description: 'Focus on warm, ready-to-convert leads instead of wasting time chasing cold prospects.',
  },
  {
    icon: <PersonalGrowthIcon />,
    title: 'Grow!',
    description: 'Focus on warm, ready-to-convert leads instead of wasting time chasing cold prospects.',
  },
];

function Index() {
  return (
    <>
      <SeoHead title="For Business Owners" />
      <div className="bg-[#FFF]">
        <Navigation />
        <div className="container">
          <FeatureParentComponent className="items-center md:my-[60px]">
            <FeatureCard
              showFeaturesList={false}
              h1="Grow your"
              h1tinted=" Business"
              h1middle=" as a"
              h2tinted=" with Data"
              description="At Uri, partnerships drive creativity and success. Let’s build something great together."
            />
            <Image alt="" src={'/assets/images/partner-img.png'} width={600} height={340} className="object-contain flex-1" />
          </FeatureParentComponent>

          <Partners />

          <WhyPartner />

          <FeatureParentComponent className="flex-col-reverse md:flex-row" id="lead-partnership">
            <Image alt="Handshake illustration" src="/assets/images/partner-handshake.png" width={600} height={500} className="object-contain w-full md:w-1/2" />
            <FeatureCard h1="Want to become a" h1tinted=" Partner" h1middle="?" showFeatureTitle={true} data={partnerCardData} />
          </FeatureParentComponent>

          <PartnerProgramOptions />
          <Box sx={{ marginBottom: '50px' }} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Index;
