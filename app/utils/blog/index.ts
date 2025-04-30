import { BlogErrorProps } from "@/app/types";
import { object, string, ZodError } from "zod";

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
    imageId: string().min(1, "Image is required").nullable(),
  });
};

export const getEditBlogSchema = (title: string, content: string) => {
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
};

export function isBlogError(error: any): error is BlogErrorProps {
  return error && Object.values(error).some((val) => typeof val === "string");
}
