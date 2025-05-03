"use client";

import { useGetBlogs } from "@/app/hooks/blog";
import { useCallback, useEffect, useState } from "react";
import { BlogCard, Header, Pagination } from "../components/index";
import { useSearchParams } from "next/navigation";
import { useToast } from "../store/toast";

const Page = () => {
  const { setToast } = useToast();
  const { loading, data, handleGetBlogs, error } = useGetBlogs();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "create-d-desc";
  const searchBy = searchParams.get("searchBy") ?? "";

  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === currentPage || newPage < 1) return;

      setCurrentPage(newPage);

      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("page", newPage.toString());
      const newUrl = `${
        window.location.pathname
      }?${newSearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    [currentPage]
  );

  useEffect(() => {
    if (!searchParams.get("sortBy")) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("sortBy", sortBy);
      window.history.pushState({}, "", newUrl.toString());
    }

    handleGetBlogs(query, sortBy, searchBy, currentPage);
  }, [query, sortBy, searchBy, currentPage, handleGetBlogs]);

  useEffect(() => {
    if (error) {
      setToast(error.message, "error");
    }
  }, [error, setToast]);

  if (loading) {
    return (
      <div className="flex w-full flex-1 justify-center items-center">
        <span className="loading loading-spinner w-[5rem]"></span>
      </div>
    );
  }

  return (
    <main className="mt-16 h-full flex items-center flex-col gap-10 p-4">
      <div className="flex justify-center w-full">
        <Header />
      </div>

      <div className="flex flex-col justify-center items-center gap-10 w-full h-full">
        {data && data.blogs && data.blogs.length > 0 ? (
          data.blogs.map((blog) => <BlogCard key={blog.id} cardData={blog} />)
        ) : (
          <div className="flex font-semibold text-xl sm:text-2xl md:text-6xl m-auto">
            No Blogs Found {":("}
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={data?.totalPages ?? 1}
      />
    </main>
  );
};

export default Page;
