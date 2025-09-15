import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI__INSIGHT_SVC_PATH = BackendUrlEnum.INSIGHTS;

type ISocialMediaPostApi =
  | "getPostById"
  | "createPost"
  | "updatePost"
  | "getPostsByFilter"
  | "getPostsBySearch"
  | "deletePostById"
  | "updatePostStatus"
  | "multipleCreatePost";

const rawSocialMediaPostApiRoutes: Record<ISocialMediaPostApi, string> = {
  getPostById: "/social-media-post/getById",
  createPost: "/social-media-post/create",
  updatePost: "/social-media-post/update",
  getPostsByFilter: "/social-media-post/getByFilters",
  getPostsBySearch: "/social-media-post/search",
  deletePostById: "/social-media-post/delete",
  updatePostStatus: "/social-media-post/updateStatus",
  multipleCreatePost: "/social-media-post/multipleCreate",
};

export const socialMediaPostApiRoutes: Record<ISocialMediaPostApi, string> =
  RouteHelper.createRoutes(URI__INSIGHT_SVC_PATH, rawSocialMediaPostApiRoutes);
