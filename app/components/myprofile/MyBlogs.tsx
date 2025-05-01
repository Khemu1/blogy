import { FC, useEffect, useState } from "react";
import MyBlog from "./MyBlog";
import { useDeleteBlog, useGetUserBlogs } from "@/app/hooks/blog";
import { useUserStore } from "@/app/store/user";
import { useToast } from "@/app/store/toast";

const MyBlogs: FC = () => {
  const { setToast } = useToast();
  const { error, loading } = useDeleteBlog();
  const { handleGetUserBlogs } = useGetUserBlogs();
  const { myBlogs } = useUserStore();

  useEffect(() => {
    (async () => {
      await handleGetUserBlogs();
    })();
  }, []);
  useEffect(() => {
    if (error) {
      setToast(error.message, "error");
    }
  }, [error]);

  const blogsArray = Object.values(myBlogs);

  if (blogsArray.length < 1) {
    return <div>No blogs yet, start making some!</div>;
  }

  return (
    <div className="p-3 h-full relative">
      <div className="flex flex-col gap-5 overflow-x-hidden z-0 max-h-[800px]">
        {blogsArray.map((blog) => (
          <MyBlog
            key={blog.id}
            blog={blog}
          />
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 z-40 bg-black/50 rounded-lg">
          <div className="flex w-full h-full justify-center items-center">
            <span className="loading loading-spinner w-[3rem] text-white"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
