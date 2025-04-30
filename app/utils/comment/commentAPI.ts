import { NewCommentProps } from "@/app/types";
import { CustomError } from "@/middlewares/error/CustomError";
import { handleResponse } from "../blog/blogAPI";

export const addComment = async (blogId: number, content: string) => {
  try {
    const response = await fetch(`/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogId, content }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBlogComments = async (id: number) => {
  try {
    const response = await fetch(`/api/comments/blog/${id}`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const editMyComment = async (
  commentId: number,
  blogId: number,
  comment: NewCommentProps
) => {
  try {
    const response = await fetch(`/api/comment/my-edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, blogId, comment }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const editUserComment = async (
  commentId: number,
  blogId: number,
  comment: NewCommentProps
) => {
  try {
    const response = await fetch(`/api/comment/user-edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, blogId, comment }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteMyComment = async (commentId: number) => {
  try {
    const response = await fetch(`/api/comment/my-delete/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (id: number) => {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};
