import { CommentForm, Comment } from "../../components";
import { BlogProps, CommentProps } from "@/app/types";
import { useGetBlogComments } from "@/app/hooks/comment";
import Image from "next/image";
import { useToast } from "@/app/store/toast";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";

interface BlogPageProps {
  blogData: BlogProps;
  comments: CommentProps[];
}

const BlogPage: React.FC<BlogPageProps> = ({ blogData, comments }) => {
  const { setToast } = useToast();
  const {
    handleGetBlogComments,
    comments: fetchedComments,
    success,
    error: apiCommentsError,
  } = useGetBlogComments();

  const [parsedContent, setParsedContent] = useState<string>("");
  const [parsedTitle, setParsedTitle] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    if (!blogData?.content) {
      setParsedContent("<p>No content available</p>");
      return;
    }

    const parseMarkdown = async () => {
      setIsParsing(true);
      try {
        const html = await marked(blogData.content);
        setParsedContent(html);
        setParseError(null);
      } catch (error) {
        console.error("Markdown parsing error:", error);
        setParseError("Failed to parse blog content");
        setParsedContent(
          `<div class="error">Error displaying content. Showing raw text instead.</div><pre>${blogData.content}</pre>`
        );
      } finally {
        setIsParsing(false);
      }
    };

    parseMarkdown();
  }, [blogData?.content]);
  useEffect(() => {
    const convertMarkdown = async () => {
      const html = await marked(blogData.title);
      setParsedTitle(html);
    };
    convertMarkdown();
  }, [blogData?.title]);

  if (!blogData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded-lg">
        <p>Blog post not found</p>
      </div>
    );
  }

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

  const currentComments = useMemo(
    () => (success && fetchedComments ? fetchedComments : comments),
    [success, fetchedComments, comments]
  );

  useEffect(() => {
    if (apiCommentsError) {
      setToast(
        apiCommentsError.message ?? "An unknown error occurred",
        "error"
      );
    }
    if (parseError) {
      setToast(parseError, "error");
    }
  }, [apiCommentsError, parseError, setToast]);

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-7xl mx-auto w-full bg-base-300 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <header className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: parsedTitle }}
          ></h1>
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
                src={`/assets/blogs/${
                  blogData.image.id
                }.${blogData.image.mimeType.split("/").pop()}`}
                alt="Blog header image"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </header>

        {isParsing ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div
            className="prose prose-lg dark:prose-invert break-words "
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        )}
      </article>

      <section className="max-w-7xl mx-auto bg-base-300 rounded-xl shadow-md p-6">
        <CommentForm
          blogId={blogData.id}
          refetchComments={handleGetBlogComments}
        />

        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            {currentComments.length > 0
              ? `${currentComments.length} Comment${
                  currentComments.length !== 1 ? "s" : ""
                }`
              : "No comments yet"}
          </h2>

          {currentComments.length > 0 ? (
            currentComments.map((comment, index) => (
              <Comment
                key={comment.id ?? index}
                commentData={comment}
                last={index === currentComments.length - 1}
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
      </section>
    </main>
  );
};

export default BlogPage;
