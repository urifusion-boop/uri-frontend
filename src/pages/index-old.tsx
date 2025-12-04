import HeroSection from '@/components/atoms/HeroSection';
import ChatBot from '@/components/atoms/chatbot/ChatBot';
import Enterprise from '@/components/landing/Enterprise';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import TopBrands from '@/components/landing/TopBrands';
// import UpperFooter from '@/components/landing/UpperFooter';
import Navigation from '@/components/Navigation';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SeoHead from '../components/atoms/SeoHead';
import Method from '../components/landing/Method';
import Partners from '../components/landing/Partners';
import Reviews from '../components/landing/Reviews';
import SocialReach from '../components/landing/SocialReach';
import TAndC from '../components/landing/TAndC';

export default function HomeOld() {
  const [showTAndC, setShowTAndC] = useState(false);
  const [showFAQs] = useState(false);

  const router = useRouter();
  return (
    <>
      <SeoHead />
      <div>
        <Box className="relative">
          <div>
            <Navigation />
            <HeroSection />
          </div>
          <TopBrands />
          <div className={''}>
            <LandingFeatures />
            <SocialReach />
            <Partners />
            <Method />
            <Reviews />
          </div>
          {/* <Pricing /> */}
          <Enterprise />

          {/* Chatbot Toggle Button */}
          <ChatBot
            recommendedMessages={[
              '📈 How to monitor keyword trends in real time?',
              '😊 How can I analyze the sentiment of my keywords?',
              '🚨 Can I set keyword mentions alerts?',
              '🗓️ How do I schedule posts across my social media platforms?',
            ]}
          />
        </Box>

        <Footer />

        {/* Other Components */}
        {showTAndC && <TAndC toggleTAndC={() => setShowTAndC(!showTAndC)} />}
        {showFAQs && <FAQ />}
      </div>
    </>
  );
}
