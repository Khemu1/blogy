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
  content: string
) => {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
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

export const deleteMyComment = async (commentId: number) => {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
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

export const getUserComments = async () => {
  try {
    const response = await fetch(`/api/users/comments/`);
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};
