import { useDeleteBlog } from "@/app/hooks/blog";
import { useToast } from "@/app/store/toast";
import { useUserStoreActions } from "@/app/store/user";
import { MyProfileBlogs } from "@/app/types";
import DOMPurify from "dompurify";
import { marked } from "marked";
import Link from "next/link";
import { useEffect, useState } from "react";

const MyBlog: React.FC<{
  blog: MyProfileBlogs;
}> = ({ blog }) => {
  const { setToast } = useToast();
  const { deleteBlog } = useUserStoreActions();
  const [sanitizedTitle, setSanitizedTitle] = useState(blog.title);
  const { handleDeleteBlog, success, error } = useDeleteBlog();

  useEffect(() => {
    const convertMarkdown = async () => {
      const rawHtml = await marked(blog.title);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setSanitizedTitle(sanitizedHtml);
    };
    convertMarkdown();
  }, [blog.title]);

  const handleDelete = async () => {
    try {
      await handleDeleteBlog(blog.id);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error) {
      setToast(error.message, "error");
    }
    if (success) {
      deleteBlog(blog.id);
      setToast("Blog deleted successfully!", "success");
    }
  }, [success, error]);
  return (
    <div className="flex flex-wrap sm:flex-nowrap w-full justify-between gap-3 bg-base-200 rounded-lg px-3 py-4 cursor-pointer hover:bg-base-100 transition-all">
      <Link href={`/blogs/${blog.id}`} className="flex-1 min-w-0 text_overflow">
        <h2
          className="block text-left font-semibold text-lg sm:text-xl md:text-2xl my_blog_title"
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        ></h2>
      </Link>

      <div className="flex gap-2 items-start sm:items-center flex-shrink-0">
        <Link
          href={`/blogs/edit/${blog.id}`}
          className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm"
        >
          Edit
        </Link>
        <button
          className="bg-red-600 text-white px-2 py-1 rounded-lg text-sm"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyBlog;
