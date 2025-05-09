import { EditBlogProps, NewBlogProp } from "@/app/types";
import { CustomError } from "@/middlewares/error/CustomError";

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = (await response.json()) as CustomError;
      console.log("errorData", errorData);
      throw new CustomError(
        errorData.message,
        response.status,
        errorData.type,
        errorData.safe,
        errorData.details,
        errorData.errors
      );
    } catch (err) {
      throw err;
    }
  }
  if(response.status === 204) {
    return null;
  }
  return await response.json();
};

export const getUserBlogs = async () => {
  try {
    const response = await fetch(`/api/users/blogs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBlogs = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBlog = async (id: number) => {
  try {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const addBlog = async (
  data: NewBlogProp
): Promise<{ blogId: number }> => {
  try {
    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const editBlog = async (id: number, data: EditBlogProps) => {
  try {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteBlog = async (blogId: number) => {
  try {
    const response = await fetch(`/api/blogs/${blogId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteUserBlogs = async (blogId: number, userId: number) => {
  try {
    const response = await fetch(`/api/users/${userId}/blogs`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBlogComments = async (blogId: number) => {
  try {
    const response = await fetch(`/api/comments/blog/${blogId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getBlogForEdit = async (blogId: number) => {
  try {
    const response = await fetch(`/api/blogs/fetch/${blogId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};
