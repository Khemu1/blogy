import { NewCommentProps } from "@/types";

export const addComment = async (comment: NewCommentProps, blogId: number) => {
  try {
    const response = await fetch(`/api/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment, blogId }),
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
    const response = await fetch(`/api/comment/${id}`, {
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

export const deleteUserComment = async (id: number) => {
  try {
    const response = await fetch(`/api/comment/user-delete/${id}`, {
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


