import { useCallback, useEffect, useState } from "react";
import {
  addBlog,
  getBlogs,
  editBlog,
  deleteUserBlogs,
  getBlog,
  deleteBlog,
  getUserBlogs,
  getBlogForEdit,
} from "../utils/blog/blogAPI";
import {
  AllBlogProps,
  BlogProps,
  EditBlogProps,
  NewBlogProp,
} from "@/app/types";
import { useRouter } from "next/navigation";
import { CustomError } from "@/middlewares/error/CustomError";
import { useUserStore } from "../store/user";
import { useBlogStore } from "../store/blog";

export const useGetBlogs = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    blogs: AllBlogProps[];
    totalPages: number;
  } | null>(null);
  const [error, setError] = useState<CustomError | null>(null);

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
          setError(error);
        } else {
          setError(
            new CustomError(
              "An unknown error occurred while fetching blogs",
              400
            )
          );
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
  const [error, setError] = useState<CustomError | null>(null);

  const handleGetBlog = async (id: number) => {
    setLoading(true);
    try {
      const blogData = await getBlog(id);
      setData(blogData);
      setError(null);
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error);
      } else {
        setError(
          new CustomError("An unknown error occurred while fetching blog", 400)
        );
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
  const [error, setError] = useState<CustomError | null>(null);
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
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<CustomError | null>(null);
  const handleEditBlog = async (id: number, data: EditBlogProps) => {
    try {
      setloading(true);
      await editBlog(id, data);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
      }
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error, success, routeTo]);
  return { handleEditBlog, loading, error, success };
};

export const useDeleteBlog = () => {
  const routeTo = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<CustomError | null>(null);
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
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
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
  const [error, setError] = useState<CustomError | null>(null);
  const handleLoginUser = async (blogId: number, userId: number) => {
    try {
      await deleteUserBlogs(blogId, userId);
      setBlogs(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
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
  const [error, setError] = useState<CustomError | null>(null);
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
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
      }
    } finally {
      setLoading(false);
    }
  };
  return { handleGetUserBlogs, loading, error, success };
};

export const useGetBlogForEdit = () => {
  const blogStore = useBlogStore((state) => state.setBlog);
  const routeTo = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CustomError | null>(null);

  const handleGetBlogForEdit = async (id: number) => {
    setLoading(true);
    try {
      const blogData = await getBlogForEdit(id);
      blogStore({
        ...blogData,
        image: blogData.image ?? null,
      });
      setError(null);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          routeTo.push("/login");
        }
        setError(error);
      } else {
        setError(
          new CustomError("An unknown error occurred while fetching blog", 400)
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return { handleGetBlogForEdit, loading, error };
};
