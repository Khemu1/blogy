"use client";
import { useAddComment } from "../../hooks/comment";
import { getCommentSchema, validateWithSchema } from "@/app/utils/comment";
import { useEffect, useRef, useState } from "react";
import { ZodError } from "zod";
import { Loader2, CheckCircle } from "lucide-react";

const CommentForm: React.FC<{
  blogId: number;
  refetchComments: (blogId: number) => Promise<void>;
}> = ({ blogId, refetchComments }) => {
  const [data, setData] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const {
    loading,
    error: APIError,
    success,
    handleAddComment,
  } = useAddComment();
  const schema = getCommentSchema();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (
    blogId: number,
    content: string,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      setErrors(null);
      schema.parse({ content });
      await handleAddComment(blogId, content);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(validateWithSchema(error));
      } else {
        setErrors({ content: "Error submitting comment" });
      }
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [data]);

  useEffect(() => {
    if (success) {
      setData("");
      refetchComments(blogId);
    }
  }, [success, blogId]);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Leave a comment
      </h3>

      <form
        onSubmit={(e) => handleSubmit(blogId, data, e)}
        className="space-y-4"
      >
        <div>
          <textarea
            ref={textareaRef}
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Share your thoughts..."
            className={`w-full px-4 py-3 border ${
              errors?.content || APIError?.content
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            } rounded-lg shadow-sm focus:outline-0 bg-base-100 text-white border-b-4`}
            rows={4}
          />
          {(APIError?.content || APIError?.message || errors?.content) && (
            <p className="mt-2 text-sm text-red-600">
              {errors?.content ?? APIError?.content ?? APIError?.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || success}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading || success
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#eb512b] hover:bg-[#eb512b]/90"
            } focus:outline-0  transition-colors duration-200`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Posting...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Posted!
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
