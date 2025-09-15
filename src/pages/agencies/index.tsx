import {
  ClimberIcon,
  PersonalGrowthIcon,
  WebAnalyticsIcon,
} from "@/components/atoms/Icons";
import SeoHead from "@/components/atoms/SeoHead";
import FeatureCard from "@/components/landing/FeatureCard";
import FeatureParentComponent from "@/components/landing/FeatureParentComponent";
import Header from "@/components/landing/Header";
import UpperFooter from "@/components/landing/UpperFooter";
import Image from "next/image";
import React from "react";

const connectCardData = [
  {
    icon: <ClimberIcon />,
    title: "Enhancing brand effectiveness",
    description:
      "Utilize keyword tracking to monitor brand mentions, trending topics, and competitor strategies, enabling the creation of targeted, resonant campaigns.",
  },
  {
    icon: <WebAnalyticsIcon />,
    title: "Optimizing client management",
    description:
      "Leverage account tracking to monitor client social media performance, identify growth opportunities, and maintain consistent messaging.",
  },
  {
    icon: <PersonalGrowthIcon />,
    title: "Driving new business opportunities",
    description:
      "Employ lead tracking to identify potential clients or collaborators through keyword analysis, expanding the agency network.",
  },
];

function Index() {
  return (
    <>
      <SeoHead title="For Agencies" />

      <div className="bg-[#FFF]">
        <Header />
        <div className="container">
          <FeatureParentComponent className="items-center md:my-[60px]">
            <FeatureCard
              showFeaturesList={false}
              h1="Empowering"
              h1tinted=" Agencies"
              h1middle=" with"
              description="Unlock the secret to agency success with Uri’s game-changing insights. Dive deep into market trends, audience behavior, and brand performance to craft campaigns that captivate and convert."
              h2="Insights"
            />
            <Image
              alt=""
              src={"/assets/images/empowering-agencies.png"}
              width={669}
              height={580}
              className="object-contain flex-1"
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center flex-col-reverse">
            <Image
              alt=""
              src={"/assets/images/what-uri-does.png"}
              width={669}
              height={580}
              className="h-full object-contain flex-1"
            />
            <FeatureCard
              showFeaturesList={false}
              h1="What"
              h1tinted=" Uri"
              h1middle=" Does for Agencies"
              description="Uri for agencies provides insights into market trends, audience behavior, and brand performance. Track brand mentions, competitor strategies, and client social media growth. Plan, create, and schedule content that aligns with client goals, ensuring effective, consistent campaigns."
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center">
            <FeatureCard
              showFeatureTitle={false}
              showFeaturesList={true}
              h1="Key"
              h1tinted=" Features"
              h1middle=" Just For You"
              data={connectCardData}
            />
            <Image
              alt=""
              src={"/assets/images/agency-key-features.png"}
              width={669}
              height={580}
              className="h-full object-contain flex-1"
            />
          </FeatureParentComponent>
        </div>
        <UpperFooter />
      </div>
    </>
  );
}

export default Index;
