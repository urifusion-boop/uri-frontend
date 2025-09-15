import { SocialMediaPostService } from "@/api/SocialMediaPostService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { queryClient } from "@/configs/query-client.config";
import { triggerToast } from "@/components/atoms/CustomToast";
import {
  PostType,
  SocialMediaPostSchema,
  SocialMediaPostType,
} from "@/data/schemas/SocialMediaPostSchema";
import { PostStatusEnum } from "@/models/enum-models/PostStatusEnum";
import { parseAsInteger, useQueryState } from "nuqs";
import { MediaHelper } from "@/helpers/MediaHelper";
import { TextHelper } from "@/helpers/TextHelper";
import { DocumentService } from "@/api/DocumentService";

type SocialMediaPostHookType = {
  data: PostType[];
  closeModel: () => void;
};

export const useSocialMediaPostHook = (closeDeleteModal: () => void) => {
  const { userDetails } = useAuth();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [postStatus, setPostStatus] = useState(PostStatusEnum.All);

  // Modal State Management
  const [openPostModal, setOpenPostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const methods = useForm<SocialMediaPostType>({
    resolver: zodResolver(SocialMediaPostSchema),
    mode: "all",
    shouldUnregister: false,
  });

  // Create Post Mutation
  const { mutateAsync: createPost, isLoading: isCreatingPost } = useMutation({
    mutationFn: async (param: SocialMediaPostHookType) => {
      const data = param?.data;
      if (!data)
        return triggerToast("error", "No post data found", "top-right");

      const result = await SocialMediaPostService.createMultiplePostApi(
        data.map((post) => ({
          user_id: userDetails?.userId ?? "",
          platform: post.platformDetails.platform,
          status: PostStatusEnum.SCHEDULED,
          start_date: post.start_date ?? "",
          media: post.media
            ? post.media.map((media) => ({
                media_type: MediaHelper.getMediaType(media.docType),
                caption: media.docName,
                alt_text: media.publicId,
                url: TextHelper.setUrl(media.url),
              }))
            : [],
          content: post.content,
          start_time: post.start_time,
          post_id: post.post_id,
          post_type: post.post_type,
          social_user_id: post.socialUserId,
          influencer_id: post.influencerId,
        }))
      );

      if (result.status) {
        setOpenPostModal(false);
        queryClient.invalidateQueries({ queryKey: ["social-media-posts"] });
        triggerToast("success", "Post created successfully", "top-right");
        methods.reset({});
        param.closeModel();
      } else {
        triggerToast("error", result.responseMessage, "top-right");
      }

      return result;
    },
  });

  // Edit Post Mutation
  const { mutateAsync: editPost, isLoading: isEditingPost } = useMutation({
    mutationFn: async (param: SocialMediaPostHookType) => {
      const data = param?.data;
      const mediaData =
        data?.[0]?.media?.map((media) => ({
          media_type: MediaHelper.getMediaType(media.docType),
          caption: media.docName,
          alt_text: media.publicId,
          url: TextHelper.setUrl(media.url),
        })) || [];

      const result = await SocialMediaPostService.updatePostApi({
        ...data?.[0],
        user_id: userDetails?.userId ?? "",
        post_id: data?.[0].post_id || "",
        media: mediaData,
        social_user_id: data?.[0].socialUserId,
        start_date: data?.[0].start_date,
        start_time: data?.[0].start_time,
        influencer_id: data?.[0].influencerId,
      });

      if (result.status) {
        setOpenPostModal(false);
        queryClient.invalidateQueries({ queryKey: ["social-media-posts"] });
        triggerToast("success", "Post updated successfully", "top-right");
        methods.reset({});
        param.closeModel();
      } else {
        triggerToast("error", result.responseMessage, "top-right");
        throw Error("Failed to update post");
      }

      return result;
    },
  });

  const onCreateOrEdit = (closeModal?: () => void) => {
    const values = methods.getValues("posts");

    const param: SocialMediaPostHookType = {
      data: values ?? [],
      closeModel: closeModal ?? (() => {}),
    };

    return values?.[0]?.post_id ? editPost(param) : createPost(param);
  };

  // Fetch Social Media Posts
  const { data: socialMediaPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["social-media-posts", page, postStatus, userDetails?.userId],
    queryFn: async () => {
      const result = await SocialMediaPostService.getPostsByFilterApi({
        user_id: userDetails?.userId ?? "",
        limit: 9,
        skip: (page - 1) * 9,
        ...(postStatus === PostStatusEnum.All ? {} : { status: postStatus }),
      });
      return result.responseData;
    },
  });

  // Delete Post Mutation
  const { mutateAsync: deletePost, isLoading: isDeletingPost } = useMutation({
    mutationFn: async () => {
      if (!selectedPostId)
        return triggerToast("error", "No post selected", "top-right");

      const selectedPost = socialMediaPosts?.data?.find(
        (post) => post.post_id === selectedPostId
      );

      let mediaIds: string[] = [];

      if (selectedPost?.media && selectedPost?.media?.length > 0) {
        mediaIds = selectedPost?.media.map((media) => media?.alt_text);

        const deleteMediaResult =
          await DocumentService.deleteMultipleFiles(mediaIds);

        if (!deleteMediaResult.status) {
          triggerToast("error", deleteMediaResult.responseMessage, "top-right");
          return;
        }
      }

      const result =
        await SocialMediaPostService.deletePostByPostIdApi(selectedPostId);

      if (result.status) {
        queryClient.invalidateQueries({ queryKey: ["social-media-posts"] });
        triggerToast("success", "Post deleted successfully", "top-right");

        setSelectedPostId(null);
        closeDeleteModal();
      } else {
        triggerToast("error", result.responseMessage, "top-right");
      }

      return result;
    },
  });

  return {
    methods,
    onCreateOrEdit,
    isCreatingOrEditingPost: isCreatingPost || isEditingPost,
    openPostModal,
    setOpenPostModal,
    socialMediaPosts,
    isPostsLoading: isPostsLoading,
    editPost,
    deletePost,
    isDeletingPost,
    selectedPostId,
    setSelectedPostId,
    setPage,
    page,
    postStatus,
    setPostStatus,
  };
};
