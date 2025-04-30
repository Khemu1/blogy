import { LoginErrorProps, RegisterErrorProps } from "@/app/types";
import { object, string, ZodIssueCode } from "zod";


export const registerSchema = () => {
  return object({
    email: string({ required_error: "Email is required" }).email(),
    username: string({ required_error: "Username is required" }).min(
      3,
      "Minimum length of username is 3 characters"
    ),
    password: string({ required_error: "Password is required" })
      .min(8, "minimum length of password is 8 characters")
      .max(30, "maximum length of password is 30 characters"),
    confirmPassword: string({
      required_error: "Confirm Password is required",
    }),
  }).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        // he code property is required, and in this case, we're using the ZodIssueCode.custom to indicate that this is a custom validation issue.
        code: ZodIssueCode.custom, // Adding the 'code' property
        path: ["confirmPassword"], // The error will be on the confirmPassword field
        message: "Passwords must match",
      });
    }
  });
};

export const loginSchema = () => {
  return object({
    emailOrUsername: string({
      required_error: "Email or Username is required",
    }).refine((val: string) => val.trim().length > 0, {
      message: "Email or Username is required",
    }),
    password: string({ required_error: "Password is required" }).refine(
      (val: string) => val.trim().length > 0,
      {
        message: "Password is required",
      }
    ),
  });
  /**
   * The refine method should validate that the field has content
   * rather than being empty. The condition inside the refine should check for a non-empty string.
   */
};

export function isLoginError(error: any): error is LoginErrorProps {
  return error && Object.values(error).some((val) => typeof val === "string");
}

export function isRegisterError(error: any): error is RegisterErrorProps {
  return error && Object.values(error).some((val) => typeof val === "string");
}
