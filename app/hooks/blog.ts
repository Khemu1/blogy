import { useCallback, useEffect, useState } from "react";
import {
  addBlog,
  getBlogs,
  editBlog,
  deleteUserBlogs,
  getBlog,
  deleteBlog,
  getUserBlogs,
} from "../utils/blog/blogAPI";
import {
  AllBlogProps,
  BlogErrorProps,
  BlogProps,
  EditBlogProp,
  NewBlogProp,
} from "@/app/types";
import { isBlogError } from "@/app/utils/blog";
import { useRouter } from "next/navigation";
import { CustomError } from "@/middlewares/error/CustomError";
import { useUserStore } from "../store/user";

export const useGetBlogs = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    blogs: AllBlogProps[];
    totalPages: number;
  } | null>(null);
  const [error, setError] = useState<BlogErrorProps | null>(null);

  const handleGetBlogs = useCallback(
    async (
      q: string = "",
      sortBy: string = "",
      searchBy: string = "",
      currentPage: number
    ) => {
      const searchParams = new URLSearchParams({
        q,
        sortBy,
        searchBy,
        page: currentPage.toString(),
      });
      try {
        const url = `/api/blogs?${searchParams.toString()}`;
        setLoading(true);
        const fetchedBlogs = await getBlogs(url);
        setData(fetchedBlogs);
      } catch (error) {
        if (error instanceof CustomError) {
          setError(error.errors);
        } else {
          setError({
            message: "An unknown error occurred while fetching blogs",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handleGetBlogs, loading, error, data };
};

export const useGetBlog = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BlogProps | null>(null);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const handleGetBlog = async (id: number) => {
    setLoading(true);
    try {
      const blogData = await getBlog(id);
      setData(blogData);
      setError(null);
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error.errors);
      } else {
        setError({ message: "An unknown error occurred while fetching blog" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleGetBlog, loading, error, data };
};

export const useAddBlog = () => {
  const routeTo = useRouter();
  const [blogId, setBlogId] = useState<{ blogId: number } | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const handleAddBlog = async (data: NewBlogProp) => {
    try {
      setloading(true);
      setBlogId((await addBlog(data)) as { blogId: number });
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error.errors);
      } else {
        setError({ message: "An unknown error occurred while adding blog" });
      }
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        routeTo.push(`/blogs/${blogId?.blogId}`);
      }, 2000);
    }
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error, success, routeTo]);
  return { handleAddBlog, loading, error, blogId, success };
};

export const useEditBlog = () => {
  const routeTo = useRouter();
  const [loading, setloading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const handleEditBlog = async (id: number, data: EditBlogProp) => {
    try {
      setloading(true);
      await editBlog(id, data);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error.errors);
      } else {
        setError({
          message: "An unknown error occurred while adding blog",
        });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleEditBlog, loading, error, success };
};

export const useDeleteBlog = () => {
  const routeTo = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const handleDeleteBlog = async (blogId: number) => {
    try {
      setloading(true);
      await deleteBlog(blogId);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error.errors);
      } else {
        setError({
          message: "An unknown error occurred while adding blog",
        });
      }
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);
  return { handleDeleteBlog, loading, error, success };
};

export const useDeleteUserBlogs = () => {
  const routeTo = useRouter();
  const [loading, setloading] = useState(true);
  const [blogs, setBlogs] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const handleLoginUser = async (blogId: number, userId: number) => {
    try {
      await deleteUserBlogs(blogId, userId);
      setBlogs(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error.errors);
      } else {
        setError({
          message: "An unknown error occurred while adding blog",
        });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleLoginUser, loading, error, blogs };
};

export const useGetUserBlogs = () => {
  const routeTo = useRouter();
  const { setMyBlogs } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState(false);
  const handleGetUserBlogs = async () => {
    try {
      const fetchedBlogs = await getUserBlogs();
      setMyBlogs(fetchedBlogs);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error.errors);
      } else {
        setError({ message: "Editing failed" });
      }
    } finally {
      setLoading(false);
    }
  };
  return { handleGetUserBlogs, loading, error, success };
};
