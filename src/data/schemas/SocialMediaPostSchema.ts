import z from "zod";
import FileSchema from "./FileSchema";
import { SocialMediaEnum } from "@/models/enum-models/SocialMediaEnum";

export const PostSchema = z
  .object({
    platformDetails: z.object({
      platform: z.string().min(1, "Platform is required"),
      username: z.string(),
    }),
    post_type: z.string().min(1, "Post type is required"),
    content: z.string().min(1, "Content is required"),
    media: z.array(FileSchema).optional(),
    hashtags: z.array(z.string()).optional(),
    mentions: z.array(z.string()).optional(),
    post_url: z.string().optional(),
    start_date: z.string().optional(),
    start_time: z.string().min(1, "Start time is required"),
    status: z.string().optional(),
    post_id: z.string().optional(),
    socialUserId: z.string(),
    influencerId: z.string(),
  })
  .refine(
    (data) => {
      const platform = data.platformDetails.platform;
      if (
        platform === SocialMediaEnum.INSTAGRAM ||
        platform === SocialMediaEnum.TIKTOK
      ) {
        return data.media && data.media.length > 0;
      }
      return true;
    },
    {
      message: "Media is required for Instagram and TikTok posts.",
      path: ["media"], // Error will be attached to the media field
    }
  );

export type PostType = z.infer<typeof PostSchema>;

export const SocialMediaPostSchema = z.object({
  posts: z.array(PostSchema),
});

export type SocialMediaPostType = z.infer<typeof SocialMediaPostSchema>;
