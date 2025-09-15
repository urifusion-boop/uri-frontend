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
    title: "Improving Customer Insights",
    description:
      "Track customer conversations about your brand, products, or services through keyword analysis.",
  },
  {
    icon: <WebAnalyticsIcon />,
    title: "Boosting Brand Performance",
    description:
      "Use account tracking to monitor and enhance your online presence.",
  },
  {
    icon: <PersonalGrowthIcon />,
    title: "Generating Sales Leads",
    description:
      "Identify and nurture potential customers using lead tracking.",
  },
];

function Index() {
  return (
    <>
      <SeoHead title="For Business Owners" />
      <div className="bg-[#FFF]">
        <Header />
        <div className="container">
          <FeatureParentComponent className="items-center md:my-[60px]">
            <FeatureCard
              showFeaturesList={false}
              h1="Driving"
              h1tinted=" Business"
              h1middle=" Success"
              h2tinted=" with Data"
              description="Unlock the power of data with Uri, the ultimate solution for businesses looking to understand their customers, stay ahead of market trends, and outpace competitors."
            />
            <Image
              alt=""
              src={"/assets/images/driving-data.png"}
              width={669}
              height={400}
              className="object-contain flex-1"
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center flex-col-reverse">
            <Image
              alt=""
              src={"/assets/images/connect-social-media.png"}
              width={669}
              height={580}
              className="h-full object-contain flex-1"
            />
            <FeatureCard
              showFeaturesList={false}
              h1="What"
              h1tinted=" Uri"
              h1middle=" Does for"
              h2=" Business"
              description="Transform your decision-making with Uri’s cutting-edge insights. Dive deep into customer behaviour to uncover what drives engagement and loyalty."
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
