"use client";
import { useGetMyInfo } from "@/app/hooks/user";
import { useEffect, useState } from "react";
import { MyInfo, MyBlogs, MyComments } from "../components/index";
import { useUserStore } from "../store/user";
import { useToast } from "../store/toast";

const Page = () => {
  const user = useUserStore();
  const [selected, setSelected] = useState<"user_info" | "blogs" | "comments">(
    "user_info"
  );
  const { loading, handleGetMyInfo, error } = useGetMyInfo();
  const { setToast } = useToast();

  useEffect(() => {
    handleGetMyInfo();
  }, [user.id]);

  useEffect(() => {
    if (error) {
      console.log("error", error);
      setToast(error.message, "error");
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-spinner w-[8rem]"></span>
      </div>
    );
  }

  return (
    <section className="mt-5 flex flex-col gap-5 h-full px-4">
      <header className="flex items-center flex-shrink flex-grow-0 w-full">
        <div className="flex w-full justify-around items-center gap-1 rounded-xl">
          {["user_info", "blogs", "comments"].map((tab) => (
            <button
              key={tab}
              value={tab}
              className={`w-full cursor-pointer text-center rounded-lg h-[40px] ${
                selected === tab ? "bg-[#eb512b] text-white" : "bg-base-200"
              } transition-all`}
              onClick={() => setSelected(tab as typeof selected)}
            >
              {tab.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </header>

      <section className="flex-shrink-0 flex flex-col gap-8 flex-grow bg-base-300 rounded-xl flex-1 relative p-4">
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
