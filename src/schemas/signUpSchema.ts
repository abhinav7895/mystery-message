import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be atleast 3 characters")
  .max(20, "Username must be atleast 16 characters")
  .regex(/^[a-zA-Z0-9_]{3,16}$/, "Username must not contain special characters");


export const SignUpSchema = z.object({
    userName : userNameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6, {message : "Password contains must be atleat 6 characters"})
})