import { NewCommentProps } from "@/app/types";

export const addComment = async (blogId: number, content: string) => {
  try {
    const response = await fetch(`/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogId, content }),
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getBlogComments = async (id: number) => {
  try {
    const response = await fetch(`/api/comments/blog/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
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
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
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
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
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
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
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
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
