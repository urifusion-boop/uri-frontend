import { useCallback, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { DateFilterEnum } from "@/models/enum-models/DateFIlterEnum";
import { MentionDto } from "@/models/dtos/MentionInsightsDto";
import { MentionService } from "@/api/MentionInsightsService";
import { queryClient } from "@/configs/query-client.config";
import { triggerToast } from "@/components/atoms/CustomToast";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryState } from "nuqs";

enum FilterType {
  INBOX = "inbox",
  STARRED = "starred",
  DELETED = "Deleted",
}

export const useAlertHook = () => {
  const { userDetails } = useAuth();
  const [selectedDate, setSelectedDate] = useState<DateFilterEnum | null>(null);
  const [readInbox, setReadInbox] = useState("All");

  // Query State for Filters and UI Preferences
  const [filter, setFilter] = useQueryState("filter", {
    defaultValue: "inbox",
  });

  // Selected Mention
  const [selectedMention, setSelectedMention] = useState<MentionDto | null>();

  /**
   * Helper function to invalidate queries.
   */
  const invalidateMentionsQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["tracker-mentions"] });
  }, []);

  /**
   * Mutation to mark a mention as read.
   */
  const markAsReadMutation = useMutation({
    mutationFn: async (mentionId: string) => {
      if (selectedMention?.is_read) return;

      const result = await MentionService.markAsRead(mentionId);
      if (result.status) {
        invalidateMentionsQuery();
      } else {
        triggerToast("error", result.responseMessage, "top-right");
      }
      return result.responseData;
    },
  });

  /**
   * Mutation to mark a mention as starred.
   */
  const markAsStarredMutation = useMutation({
    mutationFn: async ({ mentionId, starred }: { mentionId: string; starred: boolean }) => {
      const result = await MentionService.markAsStarred(mentionId, starred);

      if (result.status) {
        invalidateMentionsQuery();
      } else {
        triggerToast("error", result.responseMessage, "top-right");
      }
      return result.responseData;
    },
    onMutate: ({ starred }) => {
      setSelectedMention((prev) => (prev ? { ...prev, starred } : prev));
    },
  });

  /**
   * Mutation to delete a mention.
   */
  const markAsDeleteMutation = useMutation({
    mutationFn: async (mentionId?: string) => {
      setSelectedMention(null);
      if (!mentionId) return;

      const result = await MentionService.delete(mentionId);
      if (result.status) {
        invalidateMentionsQuery();
      } else {
        triggerToast("error", result.responseMessage, "top-right");
      }
      return result.responseData;
    },
  });

  /**
   * Infinite Query to fetch mentions based on filters.
   */
  const useMentions = () =>
    useInfiniteQuery({
      queryKey: ["tracker-mentions", filter, readInbox],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await MentionService.getMentionByFilters({
          user_id: userDetails?.userId ?? "",
          deleted: filter === FilterType.DELETED,
          starred: filter === FilterType.STARRED,
          limit: 50,
          skip: (pageParam - 1) * 50,
          ...(readInbox === "Read" && { read: true }),
          ...(readInbox === "Unread" && { unread: true }),
        });
        return { mentions: result.responseData, page: pageParam };
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil((lastPage?.mentions?.total ?? 0) / 50);
        return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
      },
    });

  /**
   * Query to fetch analysis data.
   */

  const alertAnalysisData = useQuery({
    queryKey: ["alert-analysis", selectedDate],
    queryFn: async () => {
      const result = await MentionService.analysis(userDetails?.userId ?? "", selectedDate ?? DateFilterEnum.LAST_2_MONTHS);
      return result.responseData;
    },
  });

  return {
    filter,
    setFilter,
    selectedMention,
    setSelectedMention,
    markAsReadMutation,
    useMentions,
    markAsDeleteMutation,
    markAsStarredMutation,
    alertAnalysisData,
    selectedDate,
    setSelectedDate,
    setReadInbox,
    readInbox,
  };
};
