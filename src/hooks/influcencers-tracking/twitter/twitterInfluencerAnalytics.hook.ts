import { InfluencerService } from "@/api/InfluencerService";
import { XInsightsService } from "@/api/XInsightsService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useTwitterInfluencerAnalysis = () => {
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
    queryKey: ["twitterBusinessDiscovery", influencer_id],
    queryFn: async () => {
      if (influencerData?.token) {
        const response = await XInsightsService.businessDiscovery(
          (influencerData?.token ?? "") as string
        );

        return response.responseData;
      } else return null;
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
