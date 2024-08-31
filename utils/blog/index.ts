import { BlogErrorProps, LoginErrorProps, RegisterErrorProps } from "@/types";
import { object, string, ZodError, ZodIssueCode } from "zod";

export const validateWithSchema = <T>(error: any) => {
  if (error instanceof ZodError) {
    const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
      acc[curr.path.join(".")] = curr.message;
      return acc;
    }, {});
    return errors; // Return the errors object
  }

  return null; // Return null if the error is not a ZodError
};

export const getNewBlogSchema = () => {
  return object({
    title: string({
      required_error: "Email or Username is required",
    }).refine((val: string) => val.trim().length > 0, {
      message: "Title is required",
    }),
    content: string({ required_error: "Blog content is required" }).refine(
      (val: string) => val.trim().length > 0,
      {
        message: "Blog content is required",
      }
    ),
  });
  /**
   * The refine method should validate that the field has content
   * rather than being empty. The condition inside the refine should check for a non-empty string.
   */
};

export const editBlog = (title: string, content: string) => {
  return object({
    title: string({
      required_error: "Email or Username is required",
    }).refine((val: string) => val.trim().length > 0, {
      message: "Title is required",
    }),
    content: string({ required_error: "Blog content is required" }).refine(
      (val: string) => val.trim().length > 0,
      {
        message: "Blog content is required",
      }
    ),
  }).refine(
    (val) =>
      (val.title && val.content) ||
      title !== val.title ||
      content !== val.content,
    {
      message: "Please atleast provide a new title or a new blog content",
      path: ["titleOrContent"],
    }
  );
  /**
   * The refine method should validate that the field has content
   * rather than being empty. The condition inside the refine should check for a non-empty string.
   */
};

export function isBlogError(error: any): error is BlogErrorProps {
  return error && Object.values(error).some((val) => typeof val === "string");
}
