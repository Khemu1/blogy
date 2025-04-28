"use client";
import { useGetBlog } from "@/app/hooks/blog";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import BlogPage from "@/app/components/blog/BlogPage";

interface Props {
  params: { id: number };
}

const Blog: React.FC<Props> = ({ params: { id } }) => {
  const { loading, handleGetBlog, error, data } = useGetBlog();

  useEffect(() => {
    if (!isNaN(Number(id))) {
      handleGetBlog(id);
    }
  }, [id, handleGetBlog]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !data) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-6  items-center my-4 px-3">
      <BlogPage key={data.id} blogData={{ ...data }} comments={data.comments} />
    </div>
  );
};

export default Blog;
