import { FC, useEffect, useState } from "react";
import { MyProfileBlogs } from "@/app/types";
import MyBlog from "./MyBlog";
import { useDeleteBlog, useGetUserBlogs } from "@/app/hooks/blog";
import { useUserStore } from "@/app/store/user";

const MyBlogs: FC = () => {
  const { error, loading } = useDeleteBlog();
  const { handleGetUserBlogs } = useGetUserBlogs();
  const { myBlogs } = useUserStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };
  useEffect(() => {
    (async () => {
      await handleGetUserBlogs();
    })();
  }, []);

  const blogsArray = Object.values(myBlogs);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-xl">
        Error: {error.message}
      </div>
    );
  }

  if (blogsArray.length < 1) {
    return <div>No blogs yet, start making some!</div>;
  }

  return (
    <div className="p-3 h-full relative">
      {toastMessage && (
        <div className="toast z-50">
          <div className={`alert alert-${toastType}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 overflow-x-hidden z-0 max-h-[800px]">
        {blogsArray.map((blog) => (
          <MyBlog
            key={blog.id}
            blog={blog}
            onSuccess={(msg) => showToast(msg, "success")}
            onError={(msg) => showToast(msg, "error")}
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
