import { RouteHelper } from "../../helpers/RouteHelper";
import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ISentimentAnalysisInsightsApi = "commentSentiment";

const rawSentimentAnalysisInsightsRoutes: Record<
  ISentimentAnalysisInsightsApi,
  string
> = {
  commentSentiment: "/sentiment/comment-sentiment",
};

export const sentimentAnalysisInsightsRoutes: Record<
  ISentimentAnalysisInsightsApi,
  string
> = RouteHelper.createRoutes(
  URI_INSIGHTS_SVC_PATH,
  rawSentimentAnalysisInsightsRoutes
);
