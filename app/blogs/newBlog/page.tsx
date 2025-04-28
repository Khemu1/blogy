"use client";
import { useAddBlog } from "@/app/hooks/blog";
import { NewBlogProp } from "@/app/types";
import { useState, useEffect, useRef } from "react";
import { getNewBlogSchema, validateWithSchema } from "@/app/utils/blog";
import { ZodError } from "zod";
import styles from "../../styles/form.module.css";
import Image from "next/image";
import { marked } from "marked";
import { useUserStore } from "@/app/store/user";
import { useRouter } from "next/navigation";

const NewBlog = () => {
  const userStore = useUserStore();
  const routeTo = useRouter();
  const [data, setData] = useState<NewBlogProp>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");
  const schema = getNewBlogSchema();

  const { handleAddBlog, loading, error: APIerror, success } = useAddBlog();
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null);

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

  const openPreview = () => {
    if (!previewWindow || previewWindow.closed) {
      const newWindow = window.open("", "_blank", "width=600,height=400");
      setPreviewWindow(newWindow);
    }
  };

  useEffect(() => {
    // Convert and sanitize content
    const convertAndSanitizeMarkdown = async () => {
      const rawHtml = await marked(data.content);
      // Remove DOMPurify sanitization here
      setSanitizedContent(rawHtml); // Use rawHtml directly
    };

    const convertAndSanitizeMarkdownForTitle = async () => {
      const rawHtml = await marked(data.title); // Only if you want Markdown in titles
      // Remove DOMPurify sanitization here
      setSanitizedTitle(rawHtml); // Use rawHtml directly
    };
    convertAndSanitizeMarkdown();
    convertAndSanitizeMarkdownForTitle();
  }, [data.content, data.title]);

  useEffect(() => {
    const updatePreviewWindow = () => {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.document.body.innerHTML = `
        <html>
          <head>
            <title>${sanitizedTitle || "Title"}</title>
            <link href="/app/globals.css" rel="stylesheet">
            <style>
              /* Ensure text is white and background is dark */
              body {
                background-color: #1f2937; /* Tailwind's bg-gray-900 */
                color: white; /* Make text white */
              }
              .preview_title > * {
                text-overflow: ellipsis;
                overflow: hidden !important;
                white-space: nowrap;
                width: 100%;
                max-width: 100%;
              }
            </style>
          </head>
          <body>
            <div class="text-white p-4">
              <h1 class="preview_title text-3xl font-bold mb-4 text-center max-w-full truncate whitespace-nowrap text-ec overflow-hidden">
                ${sanitizedTitle || "Your title will appear here"}
              </h1>
              <div class="prose prose-lg break-words max-w-full">
                ${sanitizedContent || "Your content will appear here"}
              </div>
            </div>
          </body>
        </html>
      `;
      }
    };
    updatePreviewWindow();
  }, [sanitizedContent, sanitizedTitle, previewWindow]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [data.content]);

  useEffect(() => {
    if (userStore.id < 1) {
      routeTo.push("/blogs");
    }
  }, [userStore.id]);
  return (
    <div className="flex flex-col justify-center gap-6 items-center w-full p-4 ">
      <div className="flex  flex-col gap-3 ">
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={openPreview}
        >
          Open Preview in New Tab
        </button>
      </div>
      <form
        className="flex w-[85dvw] sm:w-[500px] flex-col justify-center items-center gap-4 bg-base-200 p-6 rounded-lg shadow-md  transition-all"
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
            className="p-3 rounded-md focus:outline-none"
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
            className="p-3 rounded-md focus:outline-none"
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
    </div>
  );
};

export default NewBlog;
