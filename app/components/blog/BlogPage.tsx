"use client";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import "../../styles/blogPage.css"; // Import the CSS module
import { CommentForm, Comment } from "../../components/index";
import { BlogProps, CommentProps } from "@/types";

const BlogPage: React.FC<{ blogData: BlogProps; comments: CommentProps[] }> = ({
  blogData,
  comments,
}) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");

  useEffect(() => {
    if (blogData) {
      const convertAndSanitizeMarkdown = async () => {
        const rawHtml = await marked(blogData.content);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setSanitizedContent(sanitizedHtml);
      };

      const convertAndSanitizeMarkdownForTitle = async () => {
        const rawHtml = await marked(blogData.title);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setSanitizedTitle(sanitizedHtml);
      };

      convertAndSanitizeMarkdown();
      convertAndSanitizeMarkdownForTitle();
    }
  }, [blogData]);

  const blogContent = useMemo(() => {
    return (
      <div className={`markdownPreview_page flex flex-col`}>
        <div
          className="font-semibold text-2xl sm:text-4xl text-wrap text-center mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        ></div>
        <div className="flex flex-col gap-2 mb-5">
          <div>
            <span className="font-extrabold">Author : </span>
            <span className="font-semibold">{blogData.author}</span>
          </div>
          <div>
            <div>
              {new Date(blogData.createdAt).toLocaleDateString() ===
              new Date(blogData.updatedAt).toLocaleDateString() ? (
                <>
                  <span className="font-extrabold">Created At : </span>
                  <span className="font-semibold">
                    {new Date(blogData.createdAt).toLocaleDateString()}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-extrabold">Created At : </span>
                  <span className="font-semibold">
                    {new Date(blogData.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-extrabold">Updated At : </span>
                  <span className="font-semibold">
                    {new Date(blogData.updatedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
            <div></div>
          </div>
        </div>
        <div
          className={`markdownPreview_page  blog_page_content`}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>
      </div>
    );
  }, [blogData, sanitizedTitle, sanitizedContent]);

  const blogComments = useMemo(() => {
    return (
      <div className="flex w-full h-full flex-col gap-4 mt-5">
        {comments.map((comment, index) => (
          <Comment
            key={comment.id}
            commentData={comment}
            last={index === comments.length - 1}
          />
        ))}
        {comments.length === 0 && (
          <p className="font-semibold text-2xl">No comments yet.</p>
        )}
      </div>
    );
  }, [comments]);

  return (
    <div className="flex flex-col gap-6 w-full h-full items-center my-4 px-3">
      {blogContent}

      <div className="flex flex-col border-t-4 w-full">
        <h2 className="font-extrabold text-3xl mt-4 mb-2">Comments</h2>
        <CommentForm blogId={blogData.id} />
        {blogComments}
      </div>
    </div>
  );
};

export default BlogPage;
