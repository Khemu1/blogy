"use client";
import { useAddBlog, useEditBlog, useGetBlogForEdit } from "@/app/hooks/blog";
import { EditBlogProps } from "@/app/types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getEditBlogSchema } from "@/app/utils/blog";
import { ZodError } from "zod";
import Image from "next/image";
import { marked } from "marked";
import { useUserStore } from "@/app/store/user";
import { useParams, useRouter } from "next/navigation";
import FileUploader from "@/app/components/blog/FileUploader";
import { validateWithSchema } from "@/app/utils/comment";
import { Loader, CheckCircle, Eye, X, RotateCcw } from "lucide-react";
import { useToast } from "@/app/store/toast";
import { useBlogStore } from "@/app/store/blog";

const EditBlog = () => {
  const { setToast } = useToast();
  const userStore = useUserStore();
  const blogStore = useBlogStore((state) => state.blog);
  const router = useRouter();
  const { id } = useParams();
  const { handleGetBlogForEdit, loading: loadingBlog } = useGetBlogForEdit();
  const [hasImage, setHasImage] = useState(false);
  const [data, setData] = useState<EditBlogProps>({
    title: "",
    content: "",
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const schema = useMemo(() => getEditBlogSchema(), []);

  const { handleEditBlog, loading, error: apiError, success } = useEditBlog();

  const [sanitizedContent, sanitizedTitle] = useMemo(() => {
    return [
      marked(data.content) || "<p>Your content will appear here</p>",
      marked(data.title) || "<p>Your title will appear here</p>",
    ];
  }, [data.content, data.title]);

  const resetForm = useCallback(() => {
    setData({
      title: blogStore.title || "",
      content: blogStore.content || "",
      image: blogStore.image || null,
    });
    setFile(null);
    setErrors(null);
    setHasImage(!!blogStore.image);
  }, [blogStore]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors(null);

      try {
        const prep = {
          title: data.title,
          content: data.content,
          image:
            data.image && typeof data.image !== "string"
              ? undefined
              : typeof data.image === "string"
              ? data.image
              : null,
        };

        schema.parse(prep);
        await handleEditBlog(blogStore.id, prep);
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors(validateWithSchema(error));
        }
      }
    },
    [data, schema, handleEditBlog, blogStore.id]
  );

  const handleImageUpload = useCallback((url: string, file: File) => {
    setData((prev) => ({ ...prev, image: url }));
    setFile(file);
  }, []);

  const handleImageCancel = useCallback(() => {
    setData((prev) => ({ ...prev, image: null }));
    setFile(null);
  }, []);

  const togglePreview = useCallback(() => setShowPreview((prev) => !prev), []);

  useEffect(() => {
    if (apiError) {
      setToast(apiError.message, "error");
    }
    if (errors?.titleOrContent) {
      setToast(errors.titleOrContent, "error");
    }
  }, [apiError, errors?.titleOrContent, setToast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      setToast("Blog updated successfully", "success");
      timer = setTimeout(() => router.push(`/blogs/${blogStore.id}`), 2000);
    }
    return () => clearTimeout(timer);
  }, [success, router, blogStore.id, setToast]);

  useEffect(() => {
    if (userStore.id < 1 && !loadingBlog) {
      const timeout = setTimeout(() => router.push("/blogs"), 100);
      return () => clearTimeout(timeout);
    }
  }, [userStore.id, loadingBlog, router]);

  useEffect(() => {
    if (blogStore.id > 0) {
      resetForm();
    }
  }, [blogStore.id, resetForm]);

  useEffect(() => {
    const parsedId = +id;
    if (parsedId && typeof parsedId === "number") {
      handleGetBlogForEdit(parsedId);
    }
  }, [id]);

  if (userStore.id < 1) return null;

  return (
    <div className="w-full max-w-[700px] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[900px] xl:max-w-[1100px] mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Blog Post</h1>

      <div className="flex flex-col w-full lg:flex-row gap-8">
        <div className="flex-1">
          <form
            className="bg-base-300 p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
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
                className="w-full p-3 rounded-md focus:outline-0 dark:text-white bg-base-200"
              />
              {errors?.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 dark:text-gray-200">
                Featured Image
              </label>
              {hasImage &&
              blogStore.image &&
              typeof blogStore.image !== "string" ? (
                <div className="relative group">
                  <div className="relative w-full h-64 md:h-96 rounded-md overflow-hidden">
                    <Image
                      src={`/assets/blogs/${
                        blogStore.image.id
                      }.${blogStore.image.mimeType.split("/").pop()}`}
                      alt="Blog header image"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasImage(false);
                      setData((prev) => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full lg:opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <FileUploader
                  onUploadSuccess={handleImageUpload}
                  onRevert={handleImageCancel}
                />
              )}
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
                className="w-full p-3 rounded-md focus:outline-0 text-white h-[600px] overflow-y-auto bg-base-200"
                rows={10}
              />
              {errors?.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </button>
              </div>

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
                    Updating...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Updated!
                  </span>
                ) : (
                  "Update Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <dialog
        id="preview-modal"
        className={`modal ${showPreview ? "modal-open" : ""}`}
        onClick={togglePreview}
      >
        <div
          className="modal-box max-w-6xl h-[90vh] max-h-[800px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 bg-base-100 pt-4 pb-2 z-10">
            <h2 className="text-2xl font-bold">Blog Preview</h2>
            <button onClick={togglePreview} className="btn btn-sm btn-circle">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {file && (
              <div className="relative w-full h-64 md:h-96 rounded-md overflow-hidden mb-6">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Blog header preview"
                  fill
                  className="object-cover !m-0"
                />
              </div>
            )}
            {data.image && typeof data.image !== "string" && (
              <div className="relative w-full h-64 md:h-96 rounded-md overflow-hidden mb-4">
                <Image
                  src={`/assets/blogs/${data.image.id}.${data.image.mimeType
                    .split("/")
                    .pop()}`}
                  alt="Blog header preview"
                  fill
                  className="object-cover !m-0"
                />
              </div>
            )}
            <h1
              className="text-4xl font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
            />
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default EditBlog;
