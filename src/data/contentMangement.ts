import { ContentTypeEnum } from "@/models/enum-models/ContentTypeEnum";
import { SocialMediaEnum } from "@/models/enum-models/SocialMediaEnum";

export const contentTypeArray = {
  [SocialMediaEnum.INSTAGRAM]: [
    { label: "Post", value: ContentTypeEnum.POST },
    { label: "Reel", value: ContentTypeEnum.REEL },
    { label: "Story", value: ContentTypeEnum.STORY },
  ],
  [SocialMediaEnum.FACEBOOK]: [
    { label: "Post", value: ContentTypeEnum.POST },
    // { label: "Video", value: ContentTypeEnum.VIDEO },
    // { label: "Story", value: ContentTypeEnum.STORY },
    { label: "Reel", value: ContentTypeEnum.REEL },
  ],
  // [SocialMediaEnum.TWITTER]: [{ label: "Tweet", value: ContentTypeEnum.TWEET }],
  // [SocialMediaEnum.TIKTOK]: [
  //   { label: "TikTok Video", value: ContentTypeEnum.TIKTOK_VIDEO },
  //   { label: "TikTok Image", value: ContentTypeEnum.TIKTOK_IMAGE },
  // ],
  [SocialMediaEnum.LINKEDIN]: [
    { label: "Post", value: ContentTypeEnum.POST },
    { label: "Article", value: ContentTypeEnum.ARTICLE },
  ],
};
