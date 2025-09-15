import { CampaignPlatformEnum } from "@/models/enum-models/PlatformEnum";
import { SocialMediaEnum } from "@/models/enum-models/SocialMediaEnum";

export const platformOptions = [
  {
    name: "Facebook",
    value: CampaignPlatformEnum.FACEBOOK,
    icon: "/assets/images/facebook.png",
    text: "Are you admin of a Facebook page with connected Instagram account(s)?",
    isRecommended: true,
    info: "Full insights available",
    infoWithIcon: true,
    tooltip:
      "To start tracking insights for your Instagram Professional account, connect it through Facebook. Ensure that your Instagram Business or Creator account is linked to a Facebook page where you are an admin. This allows you to gain full access to your media, comments, @mentions, hashtags, and performance metrics.",
  },
  {
    name: "Instagram",
    value: CampaignPlatformEnum.INSTAGRAM,
    icon: "/assets/images/instagram.png",
    text: "Track Instagram account without authenticating",
    info: "Private insights are not available",
    infoWithIcon: true,
    tooltip:
      "You may not be able to view full insights with this option, If you need to view full insights for your business, consider using the recommended Facebook option.",
  },
  {
    name: "LinkedIn",
    value: CampaignPlatformEnum.LINKEDIN,
    icon: "/assets/icons/linkedin.svg",
    text: "Track LinkedIn account",
    infoWithIcon: false,
  },
  {
    name: "TikTok",
    value: CampaignPlatformEnum.TIKTOK,
    icon: "/assets/images/tiktok.png",
    text: "Track TikTok account",
    infoWithIcon: false,
    disable: true,
    tooltip: "Coming soon!",
  },
  {
    name: "X",
    value: CampaignPlatformEnum.X,
    icon: "/assets/images/x.png",
    text: "Track X account",
    infoWithIcon: false,
    disable: true,
    tooltip: "Coming soon!",
  },
];

export const availablePlatforms = [
  // {
  //   name: "Instagram",
  //   value: CampaignPlatformEnum.INSTAGRAM,
  //   icon: "/assets/icons/instagram.svg",
  //   text: "Connect your Instagram account to share posts.",
  //   tokenProvider: SocialMediaEnum.INSTAGRAM,
  // },
  {
    name: "Facebook",
    value: CampaignPlatformEnum.FACEBOOK,
    icon: "/assets/icons/facebook.svg",
    text: "Connect your facebook account to share posts.",
    tokenProvider: SocialMediaEnum.FACEBOOK,
  },
  {
    name: "LinkedIn",
    value: CampaignPlatformEnum.LINKEDIN,
    icon: "/assets/icons/linkedin.svg",
    text: "Connect your LinkedIn account to network professionally.",
    tokenProvider: SocialMediaEnum.LINKEDIN,
    // disable: true,
  },
  {
    name: "X",
    value: CampaignPlatformEnum.TWITTER,
    icon: "/assets/icons/x.svg",
    text: "Connect your X(Twitter) account to share tweets.",
    tokenProvider: SocialMediaEnum.TWITTER,
    disable: true,
  },
  {
    name: "TikTok",
    value: CampaignPlatformEnum.TIKTOK,
    icon: "/assets/icons/tiktok.svg",
    text: "Connect your TikTok account to share videos.",
    tokenProvider: SocialMediaEnum.TIKTOK,
    disable: true,
  },
];
