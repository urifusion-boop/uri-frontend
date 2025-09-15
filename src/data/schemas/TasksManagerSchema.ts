import z from "zod";
import FileSchema from "./FileSchema";

export const TasksManagerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Title is required"),
  dueDate: z.string().optional(),
  attachments: z.array(FileSchema).optional(),
  priority: z.string().optional(),
  assignee: z.string().optional(),
  collaborators: z.array(z.string()).optional(),
  parentTask: z.string().optional(),
  subTasks: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional(),
  taskId: z.string().optional(),
});

export type TasksManagerType = z.infer<typeof TasksManagerSchema>;
