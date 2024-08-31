import { CommentErrorProps, NewCommentProps, CommentProps } from "@/types";
import { isCommentError } from "@/utils/comment";
import {
  addComment,
  deleteMyComment,
  deleteUserComment,
  editMyComment,
  editUserComment,
  getBlogComments,
} from "@/utils/comment/commentAPI";
import { useState } from "react";

export const useAddComment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommentErrorProps | null>(null);

  const handleAddComment = async (comment: NewCommentProps, blogId: number) => {
    try {
      await addComment(comment, blogId);
    } catch (error) {
      if (isCommentError(error)) setError(error);
      else setError({ message: "adding failed" });
    } finally {
      setLoading(false);
    }
  };

  return { handleAddComment, loading, error };
};

//
export const useDeleteMyComment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommentErrorProps | null>(null);

  const handleDeleteMyComment = async (id: number) => {
    try {
      await deleteMyComment(id);
    } catch (error) {
      if (isCommentError(error)) setError(error);
      else setError({ message: "Deletion failed" });
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteMyComment, loading, error };
};

export const useDeleteUserComment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommentErrorProps | null>(null);

  const handleDeleteMyComment = async (id: number) => {
    try {
      await deleteUserComment(id);
    } catch (error) {
      if (isCommentError(error)) setError(error);
      else setError({ message: "Deletion failed" });
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteMyComment, loading, error };
};

export const useEditMyComment = async () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommentErrorProps | null>(null);
  const handleEditMyComment = async (
    commentId: number,
    blogId: number,
    comment: NewCommentProps
  ) => {
    try {
      await editMyComment(commentId, blogId, comment);
    } catch (error) {
      if (isCommentError(error)) setError(error);
      else setError({ message: "Editing failed" });
    } finally {
      setLoading(false);
    }
  };
  return { handleEditMyComment, loading, error };
};

export const useEditUserComment = async () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommentErrorProps | null>(null);
  const handleEditUserComment = async (
    commentId: number,
    blogId: number,
    comment: NewCommentProps
  ) => {
    try {
      await editUserComment(commentId, blogId, comment);
    } catch (error) {
      if (isCommentError(error)) setError(error);
      else setError({ message: "Editing failed" });
    } finally {
      setLoading(false);
    }
  };
  return { handleEditUserComment, loading, error };
};

export const useGetBlogComments = async () => {
  const [comments, setComments] = useState<CommentProps | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommentErrorProps | null>(null);
  const handleEditUserComment = async (blogId: number) => {
    try {
      setComments(await getBlogComments(blogId));
    } catch (error) {
      if (isCommentError(error)) setError(error);
      else setError({ message: "Editing failed" });
    } finally {
      setLoading(false);
    }
  };
  return { handleEditUserComment, loading, error, comments };
};
