import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ILinkedinCampaignsApi =
  | "createCampaign"
  | "fetchCampaign"
  | "searchCampaign"
  | "createCampaignGroup"
  | "fetchCampaignGroup"
  | "searchCampaignGroup"
  | "linkConversionRule";

const rawLinkedinCampaignsApiRoutes: Record<ILinkedinCampaignsApi, string> = {
  createCampaign: "/linkedin-campaigns/linkedin/campaigns/create",
  fetchCampaign: "/linkedin-campaigns/linkedin/campaigns/fetch",
  searchCampaign: "/linkedin-campaigns/linkedin/campaigns/search",
  createCampaignGroup: "/linkedin-campaigns/linkedin/campaigns-groups/create",
  fetchCampaignGroup: "/linkedin-campaigns/linkedin/campaigns-groups/fetch",
  searchCampaignGroup: "/linkedin-campaigns/linkedin/campaigns-groups/search",
  linkConversionRule: "/linkedin-campaigns/linkedin/campaigns/link-conversion",
};

export const linkedinCampaignsApiRoutes: Record<ILinkedinCampaignsApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawLinkedinCampaignsApiRoutes);
