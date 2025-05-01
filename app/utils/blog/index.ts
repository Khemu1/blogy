import { object, string } from "zod";

export const getNewBlogSchema = () => {
  return object({
    title: string()
      .min(1, "Title is required")
      .max(100, "Title must be at most 100 characters"),

    content: string()
      .min(1, "Blog content is required")
      .max(5000, "Blog content must be at most 5000 characters"),

    imageId: string({ required_error: "Image is required" })
      .min(1, "Image is required")
      .nullable(),
  });
};

export const getEditBlogSchema = () => {
  return object({
    title: string()
      .min(1, "Title is required")
      .max(100, "Title must be at most 100 characters"),

    content: string()
      .min(1, "Blog content is required")
      .max(5000, "Blog content must be at most 5000 characters"),

    imageId: string().optional(),
  }).superRefine((vals, ctx) => {
    if (!vals.title && !vals.content) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide a new title or new blog content",
        path: ["titleOrContent"],
      });
    }
  });
};
