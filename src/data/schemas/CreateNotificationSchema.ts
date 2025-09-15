import { z } from "zod";

const CreateNotificationSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).optional(),
  message: z.string().min(1)
});

export default CreateNotificationSchema;
