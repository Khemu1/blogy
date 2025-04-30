"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import { CommentForm, Comment } from "../../components";
import { BlogProps, CommentProps } from "@/app/types";
import { useGetBlogComments } from "@/app/hooks/comment";
import Image from "next/image";

interface BlogPageProps {
  blogData: BlogProps;
  comments: CommentProps[];
}

const BlogPage: React.FC<BlogPageProps> = ({ blogData, comments }) => {
  const [allComments, setAllComments] = useState<CommentProps[]>(
    comments || []
  );
  const {
    handleGetBlogComments,
    comments: fetchedComments,
    success,
  } = useGetBlogComments();
  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogData) {
      setError("Blog data is not available");
      return;
    }

    const sanitizeMarkdown = async (markdown: string | undefined | null) => {
      try {
        if (!markdown) return "";
        const rawHtml = await marked(markdown);
        return DOMPurify.sanitize(rawHtml);
      } catch (err) {
        console.error("Error processing markdown:", err);
        return "";
      }
    };

    (async () => {
      try {
        const [title, content] = await Promise.all([
          sanitizeMarkdown(blogData.title),
          sanitizeMarkdown(blogData.content),
        ]);
        setSanitizedTitle(title);
        setSanitizedContent(content);
      } catch (err) {
        console.error("Error processing blog content:", err);
        setError("Failed to process blog content");
      }
    })();
  }, [blogData]);

  useEffect(() => {
    if (success && fetchedComments) {
      setAllComments(fetchedComments);
    }
  }, [success, fetchedComments]);

  const blogContent = useMemo(() => {
    if (!blogData) return null;

    const createdAt = new Date(blogData.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const updatedAt = new Date(blogData.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const isUpdated = createdAt !== updatedAt;

    return (
      <article className="max-w-7xl mx-auto w-full bg-base-300 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <header className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            dangerouslySetInnerHTML={{
              __html: sanitizedTitle || blogData.title || "Untitled Blog",
            }}
          />
          <div className="flex items-center gap-4 mb-6">
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {blogData.user?.username || "Unknown Author"}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Published: {createdAt}</span>
                {isUpdated && <span>• Updated: {updatedAt}</span>}
              </div>
            </div>
          </div>
          {blogData.image?.id && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={
                  "/assets/blogs/" +
                  blogData.image.id +
                  "." +
                  blogData.image.mimeType.split("/").pop()
                }
                alt="Blog header image"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Blog Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              sanitizedContent ||
              blogData.content ||
              "<p>No content available</p>",
          }}
        />
      </article>
    );
  }, [sanitizedTitle, sanitizedContent, blogData]);

  const blogComments = useMemo(
    () => (
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          {allComments.length > 0
            ? `${allComments.length} Comment${
                allComments.length !== 1 ? "s" : ""
              }`
            : "No comments yet"}
        </h2>

        {allComments.length > 0 ? (
          allComments.map((comment, index) => (
            <Comment
              key={comment.id ?? index}
              commentData={comment}
              last={index === allComments.length - 1}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    ),
    [allComments]
  );

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded-lg">
        <p>Loading blog post...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {blogContent}

      <section className="max-w-7xl mx-auto bg-base-300 rounded-xl shadow-md p-6">
        <CommentForm
          blogId={blogData.id}
          refetchComments={handleGetBlogComments}
        />
        {blogComments}
      </section>
    </main>
  );
};

export default BlogPage;
