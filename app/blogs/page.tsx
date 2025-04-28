"use client";

import { useGetBlogs } from "@/app/hooks/blog";
import { useCallback, useEffect, useState } from "react";
import { BlogCard, Header, Pagination } from "../components/index";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const { loading, data, handleGetBlogs } = useGetBlogs();
  const searchParams = useSearchParams();

  // Manage state for current page
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") ?? "1", 10)
  );

  // Handle page change with URL update and API call
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === currentPage || newPage < 1) return; // Avoid unnecessary updates

      // Update state and URL with the new page number
      setCurrentPage(newPage);

      const AllsearchParams = new URLSearchParams(window.location.search);
      AllsearchParams.set("page", newPage.toString());
      const newUrl = `${
        window.location.pathname
      }?${AllsearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    [currentPage]
  );

  // Fetch blogs based on query parameters and current page
  useEffect(() => {
    handleGetBlogs(
      searchParams.get("q") ?? "",
      searchParams.get("sortBy") ?? "",
      searchParams.get("searchBy") ?? "",
      currentPage
    );
  }, [handleGetBlogs, searchParams, currentPage]);

  // Loading state for blogs
  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-spinner w-[8rem]"></span>
      </div>
    );
  }

  return (
    <main className="mt-16 h-full flex items-center flex-col gap-10 p-4">
      {/* Render Header */}
      <div className="flex justify-center w-full">
        <Header />
      </div>

      {/* Render Blog Cards or No Blogs Found */}
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

export default Page;
