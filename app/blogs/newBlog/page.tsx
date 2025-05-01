"use client";
import { useAddBlog } from "@/app/hooks/blog";
import { NewBlogProp } from "@/app/types";
import { useState, useEffect, useRef } from "react";
import { getNewBlogSchema } from "@/app/utils/blog";
import { ZodError } from "zod";
import Image from "next/image";
import { marked } from "marked";
import { useUserStore } from "@/app/store/user";
import { useRouter } from "next/navigation";
import FileUploader from "@/app/components/blog/FileUploader";
import { validateWithSchema } from "@/app/utils/comment";
import { Loader, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/app/store/toast";

const NewBlog = () => {
  const { setToast } = useToast();
  const userStore = useUserStore();
  const routeTo = useRouter();
  const [data, setData] = useState<NewBlogProp>({
    title: "",
    content: "",
    imageId: null,
  });
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");
  const schema = getNewBlogSchema();

  const { handleAddBlog, loading, error: apiError, success } = useAddBlog();
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const handleSubmit = (data: NewBlogProp, e: React.FormEvent) => {
    console.log("submit");

    e.preventDefault();
    try {
      setErrors(null);
      schema.parse(data);
      handleAddBlog(data);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(validateWithSchema(error));
      }
      throw error;
    }
  };

  useEffect(() => {
    if (apiError) {
      setToast(apiError.message, "error");
    }
  }, []);

  const handleImageUpload = (url: string, file: File) => {
    console.log("adding image", url, file);
    setData((prev) => ({ ...prev, imageId: url }));
    setFile(file);
  };
  const handleImageCancle = () => {
    setData((prev) => ({ ...prev, imageId: null }));
    setFile(null);
  };

  useEffect(() => {
    const convertAndSanitizeMarkdown = async () => {
      const rawHtml = await marked(data.content);
      setSanitizedContent(rawHtml);
    };

    const convertAndSanitizeMarkdownForTitle = async () => {
      const rawHtml = await marked(data.title);
      setSanitizedTitle(rawHtml);
    };

    convertAndSanitizeMarkdown();
    convertAndSanitizeMarkdownForTitle();
  }, [data.content, data.title]);

  useEffect(() => {
    if (userStore.id < 1) {
      const timeout = setTimeout(() => {
        routeTo.push("/blogs");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [userStore.id, routeTo]);

  return (
    <div className="w-full max-w-[700px] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[900px] xl:max-w-[1100px] mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create New Blog Post
      </h1>

      <div className="flex flex-col w-full lg:flex-row gap-8">
        <div className="flex-1">
          <form
            className="bg-base-300 p-6 rounded-lg shadow-lg"
            onSubmit={(e: React.FormEvent) => handleSubmit(data, e)}
          >
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-lg font-medium mb-2 dark:text-gray-200"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter your blog title"
                value={data.title}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-3  rounded-md focus:outline-0   dark:text-white"
              />
              {errors?.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 dark:text-gray-200">
                Featured Image
              </label>
              <FileUploader
                onUploadSuccess={handleImageUpload}
                onRevert={handleImageCancle}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-lg font-medium mb-2 dark:text-gray-200"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="Write your blog content here (Markdown supported)"
                value={data.content}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full p-3  rounded-md focus:outline-0  text-white h-[600px] overflow-y-scroll"
                rows={10}
              />
              {errors?.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Eye className="h-5 w-5" />
                Preview
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors flex-1 max-w-xs ${
                  loading
                    ? "bg-[#eb512b]/85"
                    : "bg-[#eb512b] hover:bg-[#eb512b]/90"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Publishing...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Published!
                  </span>
                ) : (
                  "Publish Post"
                )}
              </button>
            </div>
          </form>
        </div>

        {showPreview && (
          <div className="flex-1 hidden lg:block w-[450px]">
            <div className="bg-base-300 p-6 rounded-lg shadow-lg sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Live Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="prose prose-invert min-w-full max-w-full">
                {file && (
                  <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Blog header preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h1
                  className="text-3xl font-bold mb-4 text-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html:
                      sanitizedTitle || "<p>Your title will appear here</p>",
                  }}
                >
                  {data.title || "Your title will appear here"}
                </h1>
                <div
                  className="prose prose-invert max-w-none overflow-auto break-words"
                  dangerouslySetInnerHTML={{
                    __html:
                      sanitizedContent ||
                      "<p>Your content will appear here</p>",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <dialog
        id="preview-modal"
        className={`modal ${showPreview ? "modal-open" : ""}`}
        onClick={() => setShowPreview(false)}
      >
        <div
          className="modal-box max-w-6xl h-[90vh] max-h-[800px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4  bg-base-100 pt-4 pb-2 z-10">
            <h2 className="text-2xl font-bold">Blog Preview</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="btn btn-sm btn-circle"
            >
              ✕
            </button>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {file && (
              <div className="relative w-full h-[320px] !rounded-lg overflow-hidden mb-6">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Blog header preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-6">
              {data.title || "Your title will appear here"}
            </h1>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  sanitizedContent || "<p>Your content will appear here</p>",
              }}
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default NewBlog;
