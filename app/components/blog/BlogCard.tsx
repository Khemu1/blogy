"use client";
import { AllBlogProps } from "@/app/types";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, User2 } from "lucide-react";

const BlogCard: React.FC<{ cardData: AllBlogProps }> = ({ cardData }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>(cardData.title);
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const sanitizeMarkdown = async (markdown: string) => {
      try {
        const rawHtml = await marked(markdown || "");
        return DOMPurify.sanitize(rawHtml);
      } catch (error) {
        console.error("Error processing markdown:", error);
        return markdown;
      }
    };

    const processContent = async () => {
      const title = await sanitizeMarkdown(cardData.title);
      const content = await sanitizeMarkdown(
        cardData.content.substring(0, 200) + "..."
      );
      setSanitizedTitle(title);
      setSanitizedContent(content);
    };

    processContent();
  }, [cardData.title, cardData.content]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isUpdated = cardData.createdAt !== cardData.updatedAt;

  return (
    <Link
      href={`/blogs/${cardData.id}`}
      className={`relative bg-base-300 rounded-xl shadow-md overflow-hidden transition-all duration-300 sm:w-[75%] ${
        isHovered ? "shadow-lg transform -translate-y-1" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cardData.image?.id && (
        <div className="relative h-48 w-full">
          <Image
            src={
              "/assets/blogs/" +
              cardData.image.id +
              "." +
              cardData.image.mimeType.split("/").pop()
            }
            alt={cardData.title}
            fill
            className="object-cover transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.9 : 1 }}
          />
        </div>
      )}

      <div className="p-6 w-md">
        <h3
          className="text-xl font-bold text-white mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        />

        <div className="flex flex-col gap-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <User2 className="w-4 h-4" />
            <span>{cardData.user?.username || "Unknown Author"}</span>
          </div>

          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>
              {formatDate(cardData.createdAt)}
              {isUpdated && ` (Updated: ${formatDate(cardData.updatedAt)})`}
            </span>
          </div>
        </div>

        <div
          className="prose-invert text-gray-300 mb-6 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <div className="flex justify-end">
          <button className="btn cursor-pointer bg-[#eb512b] hover:bg-[#eb512b]/90 border-none text-white transition-all">
            Read More
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-5 transition-opacity duration-300" />
      )}
    </Link>
  );
};

export default BlogCard;
