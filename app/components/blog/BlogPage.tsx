"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import "../../styles/blogPage.css"; // Import the CSS
import { CommentForm, Comment } from "../../components";
import { BlogProps, CommentProps } from "@/app/types";
import { useGetBlogComments } from "@/app/hooks/comment";

interface BlogPageProps {
  blogData: BlogProps;
  comments: CommentProps[];
}

const BlogPage: React.FC<BlogPageProps> = ({ blogData, comments }) => {
  const [allComments, setAllComments] = useState<CommentProps[]>(comments);
  const {
    handleGetBlogComments,
    comments: fetchedComments,
    success,
  } = useGetBlogComments();

  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");
  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  useEffect(() => {
    if (blogData) {
      const sanitizeMarkdown = async (markdown: string) => {
        const rawHtml = await marked(markdown);
        return DOMPurify.sanitize(rawHtml);
      };

      (async () => {
        setSanitizedTitle(await sanitizeMarkdown(blogData.title));
        setSanitizedContent(await sanitizeMarkdown(blogData.content));
      })();
    }
  }, [blogData]);
  useEffect(() => {
    if (success) {
      console.log("sucess fetchedComments", fetchedComments);
      setAllComments(fetchedComments);
    }
  }, [success]);

  const blogContent = useMemo(() => {
    const createdAt = new Date(blogData.createdAt).toLocaleDateString();
    const updatedAt = new Date(blogData.updatedAt).toLocaleDateString();
    const isUpdated = createdAt !== updatedAt;

    return (
      <div className="markdownPreview_page flex flex-col">
        <div
          className="font-semibold text-2xl sm:text-4xl text-wrap text-center mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        />
        <div className="flex flex-col gap-2 mb-5">
          <div>
            <span className="font-extrabold">Author: </span>
            <span className="font-semibold">{blogData.user?.username}</span>
          </div>
          <div>
            <span className="font-extrabold">Created At: </span>
            <span className="font-semibold">{createdAt}</span>
            {isUpdated && (
              <>
                {" "}
                <span className="font-extrabold">| Updated At: </span>
                <span className="font-semibold">{updatedAt}</span>
              </>
            )}
          </div>
        </div>
        <div
          className="markdownPreview_page blog_page_content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    );
  }, [sanitizedTitle, sanitizedContent, blogData]);

  const blogComments = useMemo(
    () => (
      <div className="flex flex-col gap-4 mt-5 w-full">
        {allComments.length > 0 ? (
          allComments.map((comment, index) =>
            comment.id ? (
              <Comment
                key={comment.id + "-" + index}
                commentData={comment}
                last={index === allComments.length - 1}
              />
            ) : null
          )
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    ),
    [allComments]
  );

  return (
    <div className="flex flex-col gap-6 w-full h-full items-center my-4 px-3">
      {blogContent}
      <div className="flex flex-col border-t-4 w-full">
        <h2 className="font-extrabold text-3xl mt-4 mb-2">Comments</h2>
        <CommentForm
          blogId={blogData.id}
          refetchComments={handleGetBlogComments}
        />
        {blogComments}
      </div>
    </div>
  );
};

export default BlogPage;
