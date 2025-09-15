import { passwordRegex } from "@/configs/rules.config";
import { z, string } from "zod";

export const ResetPasswordSchema = z
.object({
  password: string().min(8, {
    message:
      "Password must contain atleast 8 characters, 1 number and a special character",
  }),
  confirmPassword: string(),
  token: string().min(6, { message: "Enter a valid OTP" }),
})
.refine(
  // check if passowrd pass the regex expression
  (data) => {
    if (!passwordRegex.test(data?.password)) {
      return false;
    } else {
      return true;
    }
  },
  {
    path: ["password"],
    message:
      "Password must contain atleast 8 characters, 1 number and a special character",
  }
)
.refine(
  (data) => {
    // Check if password match
    if (data?.password !== data?.confirmPassword) {
      return false;
    } else {
      return true;
    }
  },
  {
    path: ["confirmPassword"],
    message: "Password does not match",
  }
);