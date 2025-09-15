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
      "Employ lead tracking to identify potential clients or collaborators through keyword analysis, expanding the agencys network.",
  },
];

function Index() {
  return (
    <>
      <SeoHead title="For Product Teams" />
      <div className="bg-[#FFF]">
        <Header />
        <div className="container">
          <FeatureParentComponent className="items-center md:my-[60px]">
            <FeatureCard
              showFeaturesList={false}
              h1="Enhancing"
              h1tinted=" Product"
              h2tinted=" Developments"
              description="Unlock the key to successful product launches with Uri, the ultimate tool that equips product teams with customer insights, customer sentiments, and seamless communication strategies."
            />
            <Image
              alt=""
              src={"/assets/images/empowering-agencies.png"}
              width={669}
              height={580}
              className="h-full object-contain flex-1"
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center flex-col-reverse">
            <Image
              alt=""
              src={"/assets/images/what-uri-does-product.png"}
              width={669}
              height={580}
              className="h-full object-contain flex-1"
            />
            <FeatureCard
              showFeaturesList={false}
              h1="What"
              h1tinted=" Uri"
              h1middle=" Does for"
              h2=" Products Teams"
              description="Keep your brand center stage with Uri’s powerful insights. Monitor audience sentiment in real time to gauge how your content resonates and adapt quickly to trends."
            />
          </FeatureParentComponent>
          <FeatureParentComponent className="items-center">
            <FeatureCard
              showFeatureTitle={false}
              showFeaturesList={true}
              h1="How"
              h1tinted=" Uri"
              h1middle=" Supports"
              h2=" Product Teams"
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
