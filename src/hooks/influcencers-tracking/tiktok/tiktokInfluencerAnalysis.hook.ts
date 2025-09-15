import { InfluencerService } from "@/api/InfluencerService";
import { TiktokService } from "@/api/TiktokService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useTiktokInfluencerAnalysis = () => {
  const router = useRouter();

  const influencer_id = router?.query?.influencerId as string;
  let username = router.query?.username as string;

  const {
    data: influencerData,
    isLoading: fetchingInfluencer,
    error,
  } = useQuery({
    queryKey: ["influencerData", influencer_id],
    queryFn: async () => {
      const response =
        await InfluencerService.getInfluencerByIdApi(influencer_id);
      if (response.status) {
        return response.responseData;
      } else {
        throw new Error("Invalid influencer");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: businessDiscovery,
    isLoading: fetchingDiscovery,
    error: businessDiscoveryError,
  } = useQuery({
    queryKey: ["tiktokBusinessDiscovery", influencer_id],
    queryFn: async () => {
      if (influencerData?.token) {
        const response = await TiktokService.getTiktokBusinessDiscovery(
          {
            username: username,
            fields:
              "username,display_name,open_id,union_id,avatar_url_100,avatar_url,avatar_large_url,profile_deep_link,is_verified,bio_description,is_verified,follower_count,following_count,likes_count,video_count",
          },
          (influencerData?.token ?? "") as string
        );
        return response.responseData;
      }
    },
    enabled: !!influencerData?.token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    fetchingInfluencer,
    businessDiscovery,
    fetchingDiscovery,
    error,
    username,
    businessDiscoveryError,
  };
};
