"use client";

import { useGetBlogs } from "@/app/hooks/blog";
import { useCallback, useEffect, useState } from "react";
import { BlogCard, Header, Pagination } from "../components/index";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const { loading, data, handleGetBlogs } = useGetBlogs();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") ?? "1", 10)
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === currentPage || newPage < 1) return;

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

  useEffect(() => {
    const sortBy = searchParams.get("sortBy") ?? "create-d-asc";
    if (!searchParams.has("sortBy")) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("sortBy", sortBy); 
      window.history.pushState({}, "", newUrl.toString());
    }

    handleGetBlogs(
      searchParams.get("q") ?? "",
      sortBy, 
      searchParams.get("searchBy") ?? "",
      currentPage
    );
  }, [handleGetBlogs, searchParams, currentPage]);

  if (loading) {
    return (
      <div className="flex w-full flex-1 justify-center items-center ">
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
