import { z } from "zod";

export const AddAccountSchema = z.object({
  social_name: z.string().min(1, "Name is required"), // Name is required, // Email is optional but must be valid if provided
  tags: z
    .array(z.string()) // Allow tags to be an optional array of strings
    .optional(), // Mark the whole field as optional

  // We are now explicitly defining the usernames for each platform
  social_username: z.string().optional().or(z.literal("")), // Instagram username is optional but can be an empty string
});
