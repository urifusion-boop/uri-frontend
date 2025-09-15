import {
  TasksManagerSchema,
  TasksManagerType,
} from "@/data/schemas/TasksManagerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { queryClient } from "@/configs/query-client.config";
import { triggerToast } from "@/components/atoms/CustomToast";
import {
  TaskMangerStatusEnum,
  TaskMangerTypeEnum,
} from "@/models/enum-models/TaskManagerEnum";
import { TasksManagerService } from "@/api/TasksManagerService";
import { TaskMangerDto } from "@/models/dtos/TaskManagerDto";

export const useTaskManagerHook = (closeDeleteModal: () => void) => {
  const { userDetails } = useAuth();
  const [openIdeaModal, setOpenIdeaModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const methods = useForm<TasksManagerType>({
    resolver: zodResolver(TasksManagerSchema),
    mode: "all",
    shouldUnregister: false,
  });

  // Create Task Function
  const { mutateAsync: createTask, isLoading } = useMutation({
    mutationFn: async (data: TasksManagerType) => {
      const result = await TasksManagerService.createTasksMangerApi({
        ...data,
        userId: userDetails?.userId ?? "",
        assignee: "",
        collaborators: [],
        parentTask: "",
        subTasks: [],
        tags: [],
        taskType: TaskMangerTypeEnum.SOCIAL_MEDIA_POST,
      });

      if (result.status) {
        setOpenIdeaModal(false);
        queryClient.invalidateQueries({
          queryKey: ["content-management-todo-tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["content-management-in-progress-tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["content-management-done-tasks"],
        });
        triggerToast("success", "Tasks created successfully", "top-right");
        methods.reset({
          title: "",
          description: "",
          status: "",
          attachments: [],
        });
      } else {
        triggerToast("error", result.responseMessage, "top-right");
        throw Error("Something went wrong");
      }

      return result;
    },
  });

  // Edit Task Function
  const { mutateAsync: editTask, isLoading: isEditingTask } = useMutation({
    mutationFn: async (data: TaskMangerDto) => {
      const result = await TasksManagerService.updateTasksMangerApi({
        ...data,
        userId: userDetails?.userId ?? "",
        assignee: "",
        collaborators: [],
        parentTask: "",
        subTasks: [],
        tags: [],
        dueDate: new Date().toISOString(),
      });

      if (result.status) {
        setOpenIdeaModal(false);
        queryClient.invalidateQueries({
          queryKey: ["content-management-todo-tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["content-management-in-progress-tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["content-management-done-tasks"],
        });
        triggerToast("success", "Tasks created successfully", "top-right");
        methods.reset({
          title: "",
          description: "",
          status: "",
          attachments: [],
        });
      } else {
        triggerToast("error", result.responseMessage, "top-right");
      }

      return result;
    },
  });

  // Create or Edit Task
  const onCreate = methods.handleSubmit((data) => {
    data.taskId ? editTask(data) : createTask(data);
  });

  const useTasksByStatus = (key: string) =>
    useInfiniteQuery({
      queryKey: [key, userDetails?.userId],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await TasksManagerService.getTasksByFilterApi({
          userId: userDetails?.userId ?? "",
          pageNumber: pageParam,
          pageSize: 20,
        });

        return result.responseData;
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil((lastPage?.pageSize ?? 1) / 10);

        return (lastPage?.page ?? 1) < totalPages
          ? Number(lastPage?.page) + 1
          : undefined;
      },
    });

  const useToDoTasks = () => useTasksByStatus("content-management-todo-tasks");

  // function for deleting task
  const { mutateAsync: deleteTask, isLoading: isDeletingTask } = useMutation({
    mutationFn: async () => {
      const result = await TasksManagerService.deleteTaskByTaskIdApi(
        selectedTask!
      );

      if (result.status) {
        queryClient.invalidateQueries({
          queryKey: ["content-management-todo-tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["content-management-in-progress-tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["content-management-done-tasks"],
        });
        triggerToast("success", "Tasks deleted successfully", "top-right");
        closeDeleteModal();
        setSelectedTask(null);
      } else {
        triggerToast("error", result.responseMessage, "top-right");
        throw Error("Something went wrong");
      }

      return result;
    },
  });

  const toDoTaskHook = useToDoTasks();

  return {
    methods,
    onCreate,
    isCreatingTask: isLoading || isEditingTask,
    openIdeaModal,
    setOpenIdeaModal,
    isTasksLoading: toDoTaskHook.isLoading,
    editTask,
    deleteTask,
    isDeletingTask,
    selectedTask,
    setSelectedTask,
    useToDoTasks,
    toDoTaskHook,
  };
};
