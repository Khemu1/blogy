import { MyProfileComments } from "@/app/types";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Edit2, Trash2, X, Loader2 } from "lucide-react";
import { useDeleteMyComment, useEditMyComment } from "@/app/hooks/comment";
import { useUserStore } from "@/app/store/user";
import { useToast } from "@/app/store/toast";

const MyComment: FC<{
  comment: MyProfileComments;
}> = ({ comment }) => {
  const { setToast } = useToast();
  const { editComment, deleteComment } = useUserStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    error: editError,
    loading: editLoading,
    handleEditMyComment,
    data,
    success: editSuccess,
  } = useEditMyComment();

  const {
    error: deleteError,
    loading: deleteLoading,
    success: deleteSuccess,
    handleDeleteMyComment,
  } = useDeleteMyComment();

  const handleDelete = async (commentId: number) => {
    try {
      await handleDeleteMyComment(commentId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleEditMyComment(comment.id, comment.blogId, editedContent);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (editSuccess && data) {
      setToast("Comment updated successfully!", "success");
      editComment(comment.id, data.content);
      setIsEditModalOpen(false);
      setEditedContent(data.content);
    }
    if (editError) {
      setToast(editError.message, "error");
    }
  }, [editSuccess, editError]);

  useEffect(() => {
    if (deleteError) {
      setToast(deleteError.message, "error");
    }
    if (deleteSuccess) {
      setToast("Comment deleted successfully!", "success");
      deleteComment(comment.id);
    }
  }, [deleteSuccess, deleteError]);

  return (
    <>
      <div className="flex w-full justify-between gap-4 bg-base-200 rounded-lg px-4 sm:px-6 py-3 hover:bg-base-100 transition-all items-start">
        <Link href={`/blogs/${comment.blogId}`} className="flex-1 min-w-0">
          <h2 className="block text-left font-semibold text-lg sm:text-xl truncate">
            {comment.content}
          </h2>
        </Link>

        <div className="flex gap-2 flex-shrink-0 whitespace-nowrap">
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            onClick={() => handleDelete(comment.id)}
            disabled={deleteLoading}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Comment</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-sm btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-base-300 rounded-lg focus:outline-0 border-b-4 bg-base-200"
                rows={4}
                required
              />
              {editError && (
                <p className="text-red-600 text-sm text-center font-semibold">
                  {editError.message}
                </p>
              )}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-[#eb512b] hover:bg-[#eb512b]/90 text-white transition-all"
                  disabled={isSubmitting || editLoading}
                >
                  {isSubmitting || editLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyComment;
