"use client";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useGetBlog } from "@/hooks/blog";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import markdownStyles from "../../styles/blog.module.css"; // Import the CSS module

interface Props {
  params: { id: number };
}

const Blog: React.FC<Props> = ({ params: { id } }) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [sanitizedTitle, setSanitizedTitle] = useState<string>("");
  const { loading, handleGetBlog, error, data } = useGetBlog(id);

  useEffect(() => {
    if (!isNaN(Number(id))) {
      handleGetBlog();
    }
  }, [id, handleGetBlog]);

  useEffect(() => {
    if (data && data.blogData) {
      const convertAndSanitizeMarkdown = async () => {
        const rawHtml = await marked(data.blogData.content);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setSanitizedContent(sanitizedHtml);
      };

      const convertAndSanitizeMarkdownForTitle = async () => {
        const rawHtml = await marked(data.blogData.title);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        setSanitizedTitle(sanitizedHtml);
      };

      convertAndSanitizeMarkdown();
      convertAndSanitizeMarkdownForTitle();
    }
  }, [data?.blogData]);

  const blogContent = useMemo(() => {
    return data ? (
      <div className={markdownStyles.markdownPreview}>
        <div
          className="font-semibold text-6xl text-wrap text-center mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        ></div>
        <div
          className={`${markdownStyles.markdownPreview}`}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>
      </div>
    ) : (
      <div>No blog content available</div>
    );
  }, [data?.blogData, sanitizedTitle, sanitizedContent]);

  const blogComments = useMemo(() => {}, [data?.comments]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return notFound();
  }

  return (
    <div className="flex justify-center items-center my-4">{blogContent}</div>
  );
};

export default Blog;
