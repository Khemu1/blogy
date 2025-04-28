"use client";
import { useGetMyInfo } from "@/app/hooks/user";
import { useEffect, useState } from "react";
import { MyInfo, MyBlogs, MyComments } from "../components/index";
import { notFound } from "next/navigation";

const Page = () => {
  const [selected, setSelected] = useState<"user_info" | "blogs" | "comments">(
    "user_info"
  );
  const { loading, error, haneGetMyInfo, data } = useGetMyInfo();
  useEffect(() => {
    haneGetMyInfo();
  }, [haneGetMyInfo]);

  if (loading || !data) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-spinner w-[8rem]"></span>
      </div>
    );
  }
  if (error) {
    notFound();
  }
  console.log(data);
  return (
    <main className="mt-5 flex flex-col  gap-5 h-full px-4">
      {/* Sidebar */}
      <aside className="flex  items-center flex-shrink flex-grow-0 w-full ">
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
      </aside>

      {/* Main Content */}
      <section className="flex-shrink-0 flex flex-col gap-8 flex-grow bg-base-300 rounded-xl h-[90dvh] relative">
        <div className="flex flex-col justify-between p-4 h-full">
          {selected === "user_info" && (
            <MyInfo
              data={{
                email: data.email,
                id: data.id,
                username: data.username,
                password: data.password,
                updatedAt: data.updatedAt,
                createdAt: data.createdAt,
              }}
            />
          )}
          {selected === "blogs" && <MyBlogs blogs={data.Blogs} />}
          {selected === "comments" && <MyComments comments={data.comments} />}
        </div>
      </section>
    </main>
  );
};

export default Page;
