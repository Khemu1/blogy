"use client";
import { useAddComment } from "../../hooks/comment";
import { getCommentSchema, validateWithSchema } from "@/app/utils/comment";
import { useEffect, useRef, useState } from "react";
import { ZodError } from "zod";
import styles from "../../styles/form.module.css";
import Image from "next/image";

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
  const newCommentRef = useRef<HTMLTextAreaElement>(null);
  const HandleSubmit = async (
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
        const validationErrors = validateWithSchema(error);
        setErrors(validationErrors);
        console.log(validationErrors);
      } else {
        setErrors({ content: "Error parsing comment" });
        console.log("Error parsing comment", error);
      }
    }
  };

  useEffect(() => {
    const textarea = newCommentRef.current;
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
    <div>
      <form onSubmit={(e: React.FormEvent) => HandleSubmit(blogId, data, e)}>
        <textarea
          value={data}
          id="NewComment"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setData(e.target.value)
          }
          className={`${
            errors?.content || APIError?.content
              ? styles.error_bottom_border
              : ""
          }`}
          ref={newCommentRef}
        />
        {(APIError?.content || APIError?.message || errors?.content) && (
          <p className={styles.error_message}>
            {errors?.content ?? APIError?.content ?? APIError?.message}
          </p>
        )}
        <div
          className={`submit_comment_container mt-4 ${
            loading || success
              ? "bg-[#eb512b]"
              : "bg-base-200 hover:bg-secondary hover:text-white"
          }`}
        >
          {loading ? (
            <div className="flex mt-5 w-full h-full justify-center items-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : success ? (
            <Image
              src={"/assets/icons/checkmark.svg"}
              width={64}
              height={64}
              alt="Comment Created"
              priority={true}
            />
          ) : (
            <button
              type={success ? "button" : "submit"}
              className="font-semibold w-full rounded-lg py-3 transition text-2xl"
            >
              Submit
            </button>
          )}
        </div>
        {APIError?.message && (
          <p
            className={
              "flex w-full m-auto text-red-600 justify-center font-semibold mt-3"
            }
          >
            {APIError?.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CommentForm;
