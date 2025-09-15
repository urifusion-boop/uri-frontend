import { FacebookPostDto } from "@/models/dtos/FacebookInsightsDto";
import { BusinessProfileInsight } from "@/models/dtos/InstagramInsights";

const formatNumberWithCommas = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const calculateEngagement = (
  data: { like_count: number; comments_count: number }[]
): string => {
  const totalEngagement = data.reduce(
    (acc, item) => acc + item.like_count + item.comments_count,
    0
  );
  return formatNumberWithCommas(totalEngagement);
};

export const calculateTotalEngagment = (
  data: BusinessProfileInsight[]
): string => {
  const totalEngagement = data.reduce(
    (acc, item) => acc + item.like_count + item.comments_count,
    0
  );
  return formatNumberWithCommas(totalEngagement);
};
//

//  post.reduce((prev, current) => {
//    const prevEngagement = calculateEngagement([prev]);
//    const currentEngagement = calculateEngagement([current]);
//    return parseInt(currentEngagement.replace(/,/g, '')) >
//      parseInt(prevEngagement.replace(/,/g, ''))
//      ? current
//      : prev;
//  });

export const calculateMostTopPost = (
  post: BusinessProfileInsight[]
): BusinessProfileInsight => {
  return post.reduce((prev, current) => {
    const prevEngagement = calculateEngagement([prev]);
    const currentEngagement = calculateEngagement([current]);
    return parseInt(currentEngagement.replace(/,/g, "")) >
      parseInt(prevEngagement.replace(/,/g, ""))
      ? current
      : prev;
  });
};

export const calculateFacebookTopPost = (
  posts: FacebookPostDto[]
): FacebookPostDto | null => {
  if (posts.length === 0) return null;

  const postWithEngagement = posts.map((post) => {
    const reactionCount = post.reactions?.summary?.total_count || 0;
    const commentCount = post.comments?.data.length || 0;
    const engagementScore = reactionCount + commentCount;

    return { ...post, engagementScore };
  });

  postWithEngagement.sort((a, b) => b.engagementScore - a.engagementScore);

  return postWithEngagement[0];
};
