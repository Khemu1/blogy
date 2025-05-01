import { FC, useEffect, useState } from "react";
import MyComment from "./MyComment";
import { useGetUserComments } from "@/app/hooks/comment";
import { useUserStore } from "@/app/store/user";
import { useToast } from "@/app/store/toast";

const MyComments: FC = () => {
  const { setToast } = useToast();
  const { handleGetUserComments, loading, error } = useGetUserComments();
  const myComments = useUserStore((state) => state.myComments);

  useEffect(() => {
    (async () => {
      await handleGetUserComments();
    })();
  }, []);


  useEffect(() => {
    if (error) {
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

  const commentsArray = Object.values(myComments);

  if (commentsArray.length === 0) {
    return <div>No comments yet, start making some!</div>;
  }

  return (
    <div className="relative h-full">

      <div className="flex flex-col gap-5 overflow-x-hidden z-0 max-h-[600px]">
        {commentsArray.map((comment) => (
          <MyComment
            comment={comment}
            key={comment.id}
          />
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

export default MyComments;
