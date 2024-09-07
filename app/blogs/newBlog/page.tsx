"use client";
import { useAddBlog } from "@/hooks/blog";
import { NewBlogProp } from "@/types";
import { useState, useEffect, useRef } from "react";
import { getNewBlogSchema, validateWithSchema } from "@/utils/blog";
import { ZodError } from "zod";
import styles from "../../styles/form.module.css";
import Image from "next/image";
import { marked } from "marked";
import DOMPurify from "dompurify";
import markdownStyles from "../../styles/form.module.css"; // Import the CSS module

const NewBlog = () => {
  const [data, setData] = useState<NewBlogProp>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");
  const schema = getNewBlogSchema();

  const { handleAddBlog, loading, error: APIerror, success } = useAddBlog();

  const handleSubmit = (data: NewBlogProp, e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrors(null);
      schema.parse(data);
      handleAddBlog(data);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(validateWithSchema(error));
        console.log(validateWithSchema(error));
      } else {
        console.error("An error occurred during validation:", error);
      }
    }
  };

  useEffect(() => {
    // Convert and sanitize content
    const convertAndSanitizeMarkdown = async () => {
      const rawHtml = await marked(data.content);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setSanitizedContent(sanitizedHtml);
    };

    // Convert and sanitize title (if using Markdown)
    const convertAndSanitizeMarkdownForTitle = async () => {
      const rawHtml = await marked(data.title); // Only if you want Markdown in titles
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setSanitizedTitle(sanitizedHtml);
    };

    convertAndSanitizeMarkdown();
    convertAndSanitizeMarkdownForTitle();
  }, [data.content, data.title]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to match content
    }
  }, [data.content]); // Adjust when content changes

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6 items-center w-full p-4 ">
      <form
        className="flex flex-1 flex-col justify-center items-center gap-4 bg-base-200 p-6 rounded-lg shadow-md  transition-all"
        onSubmit={(e: React.FormEvent) => handleSubmit(data, e)}
      >
        <div className="flex flex-col w-full h-max">
          <label htmlFor="title" className="font-semibold text-lg mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            value={data.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {(errors?.title || APIerror?.title) && (
          <p className={styles.error}>{errors?.title ?? APIerror?.title}</p>
        )}
        <div className="flex flex-col w-full">
          <label htmlFor="content" className="font-semibold text-lg mb-2 h-max">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Content"
            value={data.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setData((prev) => ({ ...prev, content: e.target.value }))
            }
            ref={textareaRef}
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
            rows={6}
          />
        </div>
        {(errors?.content || APIerror?.content || APIerror?.message) && (
          <p className={styles.error}>{errors?.content ?? APIerror?.content}</p>
        )}
        <div
          className={`submit_comment_container mt-4 bg-base-300 ${
            loading || success
              ? "bg-[#eb512b]"
              : "bg-base-200 hover:bg-[#eb512b] hover:text-white"
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
      </form>

      <div className="flex flex-1  flex-col gap-3 ">
        {/* Title Preview */}
        <div className="w-full border-black rounded-md p-4 bg-base-200 mt-4 shadow-md">
          <h2 className="text-xl font-bold mb-2">Title Preview</h2>
          <div
            className={`${markdownStyles.markdownPreview}`}
            dangerouslySetInnerHTML={{
              __html: sanitizedTitle || "Your title will appear here",
            }}
          />
        </div>

        {/* Content Preview */}
        <div className="w-full  border-base-200 rounded-md p-4 bg-base-200  mt-4 shadow-md">
          <h2 className="text-xl font-bold mb-2">Content Preview</h2>
          <div
            className={`${markdownStyles.markdownPreview}`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewBlog;
