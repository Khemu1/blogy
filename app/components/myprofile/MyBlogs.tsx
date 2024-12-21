"user client";
import { MyProfileBlogs } from "@/types";
import MyBlog from "./MyBlog";
import { useState } from "react";
import { useDeleteBlog } from "@/hooks/blog";

const MyBlogs: React.FC<{ blogs: MyProfileBlogs[] | [] }> = ({ blogs }) => {
  const [AllBlogs, setAllBlogs] = useState<MyProfileBlogs[]>(blogs);
  const { error, loading, handleDeleteBlog } = useDeleteBlog();

  const handleDelete = async (blogId: number) => {
    try {
      await handleDeleteBlog(blogId);
      setAllBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blogId));
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (AllBlogs.length < 1) {
    return <div>No blogs yet, start making some!</div>;
  }

  return (
    <div className="p-3 h-full">
      <div className="flex flex-col gap-5 h-full overflow-y-scroll overflow-x-hidden z-0">
        {AllBlogs.map((blog) => (
          <MyBlog blog={blog} key={blog.id} deleteBlog={handleDelete} />
        ))}
      </div>
      {loading && (
        <div className="absolute inset-0 z-10 bg-black bottom-0 opacity-50 rounded-lg">
          <div className="flex w-full h-full justify-center items-center m-auto">
            <span className="loading loading-spinner w-[3rem]"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
