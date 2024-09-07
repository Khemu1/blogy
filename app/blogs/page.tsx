"use client";

import { useGetBlogs } from "@/hooks/blog";
import { useCallback, useEffect } from "react";
import { BlogCard, Header, Pagination } from "../components/index";
import { useSearchParams } from "next/navigation";

const page = () => {
  const { loading, data, handleGetBlogs } = useGetBlogs();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1) return;

      const AllsearchParams = new URLSearchParams(window.location.search);
      AllsearchParams.set("page", newPage.toString());

      const newUrl = `${
        window.location.pathname
      }?${AllsearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);

      handleGetBlogs(
        searchParams.get("q") ?? "",
        searchParams.get("sortBy") ?? "",
        searchParams.get("searchBy") ?? "",
        newPage
      );
    },
    [handleGetBlogs, searchParams]
  );

  useEffect(() => {
    if (!searchParams.get("page")) {
      handlePageChange(1);
    }
  }, []);

  useEffect(() => {
    handleGetBlogs(
      searchParams.get("q") ?? "",
      searchParams.get("sortBy") ?? "",
      searchParams.get("searchBy") ?? "",
      currentPage
    );
  }, [handleGetBlogs, searchParams, currentPage]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-spinner w-[8rem]"></span>
      </div>
    );
  }

  return (
    <main className="mt-16 h-full flex items-center flex-col gap-10 p-4">
      <div className="flex justify-center w-full">
        <Header />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-10 w-full h-full">
        {data && data.blogs.length > 0 ? (
          data.blogs.map((blog) => <BlogCard key={blog.id} cardData={blog} />)
        ) : (
          <div className="flex font-semibold text-xl sm:text-2xl md:text-6xl m-auto">
            No Blogs Found {":("}
          </div>
        )}
      </div>
      {/* Render Pagination Component */}
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={data?.totalPages ?? 1}
      />
    </main>
  );
};

export default page;
