import { CommentProps, MyProfileComments } from "@/app/types";
import {
  addComment,
  deleteMyComment,
  editMyComment,
  getBlogComments,
  getUserComments,
} from "@/app/utils/comment/commentAPI";
import { CustomError } from "@/middlewares/error/CustomError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStoreActions } from "../store/user";

export const useAddComment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CustomError | null>(null);
  const [success, setSuccess] = useState(false);
  const handleAddComment = async (blogId: number, content: string) => {
    try {
      setLoading(true);
      await addComment(blogId, content);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
        }
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
      }
    } finally {
      setLoading(false);
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
      }, 5000);
    }
  }, [success, error]);

  return { handleAddComment, loading, error, success };
};

//
export const useDeleteMyComment = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CustomError | null>(null);

  const handleDeleteMyComment = async (id: number) => {
    setLoading(true);
    try {
      await deleteMyComment(id);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
        }
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
      }
    } finally {
      setLoading(false);
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
      timer = setTimeout(() => {
        setError(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);
  return { handleDeleteMyComment, loading, error, success };
};

export const useEditMyComment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<{blogId: number, content: string} | null>(null);
  const [error, setError] = useState<CustomError | null>(null);
  const handleEditMyComment = async (
    commentId: number,
    blogId: number,
    comment: string
  ) => {
    try {
      setLoading(true);
      const data = await editMyComment(commentId, blogId, comment);
      setData(data);
      console.log("comment updated with data", data);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          router.push("/login");
        }
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
      }
    } finally {
      setLoading(false);
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
      timer = setTimeout(() => {
        setError(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);
  return { handleEditMyComment, loading, error, data, success };
};

export const useGetBlogComments = () => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState(false);
  const handleGetBlogComments = async (blogId: number) => {
    try {
      const fetchedComments = await getBlogComments(blogId);
      console.log("fetchedComments", fetchedComments.comments);
      setComments(fetchedComments.comments);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error.errors);
      } else {
        setError({ message: "Editing failed" });
      }
    } finally {
      setLoading(false);
    }
  };
  return { handleGetBlogComments, loading, error, comments, success };
};

export const useGetUserComments = () => {
  const { setMyComments } = useUserStoreActions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CustomError | null>(null);
  const [success, setSuccess] = useState(false);
  const handleGetUserComments = async () => {
    try {
      const fetchedComments = await getUserComments();

      setMyComments(fetchedComments);
      setSuccess(true);
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error);
      } else {
        setError(new CustomError("An unknown login error occurred", 400));
      }
    } finally {
      setLoading(false);
    }
  };
  return { handleGetUserComments, loading, error, success };
};
