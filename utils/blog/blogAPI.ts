import { BlogErrorProps, EditBlogProp, NewBlogProp } from "@/types";

export const getUserBlogs = async (id: number) => {
  try {
    const response = await fetch(`/api/users/${id}/blogs/`, {
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
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getBlogs = async (url: string) => {
  try {
    const response = await fetch(`${url}`, {
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
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getBlog = async (id: number) => {
  try {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const addBlog = async (
  data: NewBlogProp
): Promise<{ blogId: number } | BlogErrorProps> => {
  try {
    console.log("add the fucken blog");
    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are included in the request
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const editBlog = async (id: number, data: EditBlogProp) => {
  try {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteBlog = async (blogId: number,) => {
  try {
    const response = await fetch(`/api/blogs/${blogId}`, {
      method: "Delete",
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
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteUserBlogs = async (blogId: number, userId: number) => {
  try {
    const response = await fetch(`/api/users/${userId}/blogs`, {
      method: "Delete",
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
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
