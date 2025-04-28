import { useCallback, useEffect, useState } from "react";
import {
  addBlog,
  getBlogs,
  editBlog,
  deleteUserBlogs,
  getBlog,
  deleteBlog,
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
        if (isBlogError(error)) {
          setError(error);
        } else {
          setError({ message: "No Blogs Found" });
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
  const [error, setError] = useState<BlogErrorProps | null>(null);

  const handleGetBlog = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const blogData = await getBlog(id);
      setData(blogData);
      setError(null);
    } catch (error) {
      if (isBlogError(error)) {
        setError(error);
      } else {
        setError({ message: "Blog Not Found" });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleGetBlog, loading, error, data };
};

export const useAddBlog = () => {
  const routeTo = useRouter();
  const [blogId, setBlogId] = useState<{ blogId: number } | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<BlogErrorProps | null>(null);
  const handleAddBlog = async (data: NewBlogProp) => {
    try {
      setloading(true);
      setBlogId((await addBlog(data)) as { blogId: number });
      setSuccess(true);
    } catch (error) {
      if (isBlogError(error)) {
        setError(error);
      } else {
        setError({ message: "Adding failed" });
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
  const [loading, setloading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [error, setError] = useState<BlogErrorProps | null>(null);
  const handleEditBlog = async (id: number, data: EditBlogProp) => {
    try {
      setloading(true);
      await editBlog(id, data);
      setSuccess(true);
    } catch (error) {
      if (isBlogError(error)) {
        setError(error);
      } else {
        setError({ message: "Edit failed" });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleEditBlog, loading, error, success };
};

export const useDeleteBlog = () => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<BlogErrorProps | null>(null);

  const handleDeleteBlog = async (blogId: number) => {
    try {
      setloading(true);
      await deleteBlog(blogId);
    } catch (error) {
      if (isBlogError(error)) {
        setError(error);
      } else {
        setError({ message: "Delete failed" });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleDeleteBlog, loading, error };
};

export const useDeleteUserBlogs = () => {
  const [loading, setloading] = useState(true);
  const [blogs, setBlogs] = useState(false);
  const [error, setError] = useState<BlogErrorProps | null>(null);
  const handleLoginUser = async (blogId: number, userId: number) => {
    try {
      await deleteUserBlogs(blogId, userId);
      setBlogs(true);
    } catch (error) {
      if (isBlogError(error)) {
        setError(error);
      } else {
        setError({ message: "Delete failed" });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleLoginUser, loading, error, blogs };
};
