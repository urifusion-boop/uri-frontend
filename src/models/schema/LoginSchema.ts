import { z, string } from "zod";

export const LoginSchema = z.object({
    email: string().email("Please enter a valid email."),
    password: string().min(3, "Please enter your password."),
  });