"use client";
import { useGetMyInfo } from "@/app/hooks/user";
import { useEffect, useState } from "react";
import { MyInfo, MyBlogs, MyComments } from "../components/index";
import { notFound } from "next/navigation";
import { useUserStore } from "../store/user";

const Page = () => {
  const user = useUserStore();
  const [selected, setSelected] = useState<"user_info" | "blogs" | "comments">(
    "user_info"
  );
  const { loading, handleGetMyInfo } = useGetMyInfo();
  useEffect(() => {
    handleGetMyInfo();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-spinner w-[8rem]"></span>
      </div>
    );
  }

  return (
    <section className="mt-5 flex flex-col  gap-5 h-full px-4 ">
      <header className="flex  items-center flex-shrink flex-grow-0 w-full ">
        <div className="flex w-full justify-around items-center  gap-1 rounded-xl">
          <button
            value="user_info"
            className={` w-full cursor-pointer text-center rounded-lg h-[40px] ${
              selected === "user_info"
                ? "bg-[#eb512b] text-white"
                : "bg-base-200"
            }  transition-all `}
            onClick={() => setSelected("user_info")}
          >
            User Info
          </button>
          <button
            value="blogs"
            className={` w-full cursor-pointer text-center rounded-lg h-[40px] ${
              selected === "blogs" ? "bg-[#eb512b] text-white" : "bg-base-200"
            } transition-all `}
            onClick={() => setSelected("blogs")}
          >
            Blogs
          </button>
          <button
            value="comments"
            className={`w-full cursor-pointer text-center rounded-lg h-[40px] ${
              selected === "comments"
                ? "bg-[#eb512b] text-white"
                : "bg-base-200"
            }  transition-all `}
            onClick={() => setSelected("comments")}
          >
            Comments
          </button>
        </div>
      </header>

      <section className="flex-shrink-0 flex flex-col gap-8 flex-grow bg-base-300 rounded-xl flex-1 relative   p-4">
        {selected === "user_info" && (
          <MyInfo
            data={{
              email: user.email,
              id: user.id,
              username: user.username,
              password: "********",
              updatedAt: new Date(user.updatedAt),
              createdAt: new Date(user.createdAt),
            }}
          />
        )}
        {selected === "blogs" && <MyBlogs />}
        {selected === "comments" && <MyComments />}
      </section>
    </section>
  );
};

export default Page;
