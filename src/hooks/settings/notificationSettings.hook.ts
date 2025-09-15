import { NotificationSettingsService } from "@/api/NotificationSettingsService";
import { triggerToast } from "@/components/atoms/CustomToast";
import { queryClient } from "@/configs/query-client.config";
import { InsightNotificationSettingsDto } from "@/models/dtos/NotificationSettingDto";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useNotificationSettings = () => {
  const { userDetails } = useAuth();

  const userNotificationSettingsQuery = useQuery({
    queryKey: ["user-notification-setting-query", userDetails],
    queryFn: async () => {
      const response =
        await NotificationSettingsService.getNotificationsByUserIdApi(
          userDetails?.userId
        );

      return response.responseData;
    },
  });

  const updateUserNotificationSettingsMutation = useMutation(
    async (data: InsightNotificationSettingsDto) => {
      const response =
        await NotificationSettingsService.updateNotificationSettingsApi({
          ...data,
          userId: userDetails?.userId,
          description: userNotificationSettingsQuery?.data?.description,
        });

      if (response.status) {
        queryClient.invalidateQueries(["user-notification-setting-query"]);
        triggerToast("success", "Notification settings updated successfully");
      } else {
        triggerToast(
          "error",
          response.responseMessage ?? "Error updating notification settings"
        );
      }

      return response.responseData;
    }
  );

  return {
    userNotificationSettingsQuery,
    updateUserNotificationSettingsMutation,
  };
};
