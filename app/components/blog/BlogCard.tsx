"use client";
import { AllBlogProps } from "@/app/types";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import "../../styles/blogCard.css";
import Link from "next/link";

const BlogCard: React.FC<{ cardData: AllBlogProps }> = ({ cardData }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>(cardData.title);
  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  useEffect(() => {
    const convertAndSanitizeMarkdownForTitle = async () => {
      const rawHtml = await marked(cardData.title);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setSanitizedTitle(sanitizedHtml);
    };
    convertAndSanitizeMarkdownForTitle();
  }, [cardData.title, cardData.content]);

  return (
    <div className={`markdownPreview_card blog_card`}>
      <div
        className={`title font-semibold text-wrap text-center mb-4 text_overflow`}
        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
      ></div>
      <div className="card_date">
        {new Date(cardData.createdAt).toLocaleDateString() ===
        new Date(cardData.updatedAt).toLocaleDateString() ? (
          <div className="flex gap-2 items-center">
            <span className="font-extrabold">Created At :</span>
            <span className="font-semibold">
              {new Date(cardData.createdAt).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 items-center">
              <span className="font-extrabold">Updated At : </span>
              <span className="font-semibold">
                {new Date(cardData.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="card_author">
        <span className="font-extrabold">Author : </span>{" "}
        <span className="font-semibold">{cardData.user.username}</span>
      </div>
      <div
        className={`card_content blog_card_content flex`}
        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
      ></div>
      <Link href={`/blogs/${cardData.id}`} className="visit_card">
        Visit
      </Link>
    </div>
  );
};

export default BlogCard;
