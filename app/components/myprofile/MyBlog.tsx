import { MyProfileBlogs } from "@/types";
import DOMPurify from "dompurify";
import { marked } from "marked";
import Link from "next/link";
import { useEffect, useState } from "react";

const MyBlog: React.FC<{
  blog: MyProfileBlogs;
  deleteBlog: (blogId: number) => Promise<void>;
}> = ({ blog, deleteBlog }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>(blog.title);

  useEffect(() => {
    const convertAndSanitizeMarkdownForTitle = async () => {
      const rawHtml = await marked(blog.title);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setSanitizedTitle(sanitizedHtml);
    };
    convertAndSanitizeMarkdownForTitle();
  }, [blog.title]);
  return (
    <div className="flex max-w-full justify-between gap-2 bg-base-200 rounded-lg px-3 py-4 cursor-pointer hover:bg-base-100 transition-all overflow-hidden">
      <Link
        href={`/blogs/${blog.id}`}
        key={blog.id}
        className="flex-1 max-w-full  text_overflow"
      >
        <h2
          className="block text-left font-semibold text-xl sm:text-2xl my_blog_title "
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        ></h2>
      </Link>

      <div className="flex gap-3 justify-end font-semibold">
        <button
          type="button"
          className="bg-blue-500 text-white px-2 rounded-lg"
        >
          Edit
        </button>
        <button
          type="button"
          className="bg-red-600 text-white px-2 rounded-lg"
          onClick={() => deleteBlog(blog.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyBlog;
