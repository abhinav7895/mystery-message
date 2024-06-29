import { z } from "zod";

export const SignInSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, { message: "Password contains must be atleat 6 characters" }),
});
