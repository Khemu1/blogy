import { CommentErrorProps } from "@/app/types";
import { object, string, ZodError } from "zod";

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

export const getCommentSchema = () => {
  return object({
    content: string({ required_error: "Comment content is required" }).min(
      3,
      "Minimum length of comment's content is 3 characters"
    ),
  });
};

export const isCommentError = (error: any): error is CommentErrorProps => {
  return error && Object.values(error).some((val) => typeof val === "string");
};
