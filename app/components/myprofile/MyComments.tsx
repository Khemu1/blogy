import { FC, useEffect, useState } from "react";
import MyComment from "./MyComment";
import { useGetUserComments } from "@/app/hooks/comment";
import { useUserStore } from "@/app/store/user";

const MyComments: FC = () => {
  const { handleGetUserComments, loading, error } = useGetUserComments();
  const myComments = useUserStore((state) => state.myComments);
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
      await handleGetUserComments();
    })();
  }, []);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-xl">
        Error: {error.message}
      </div>
    );
  }
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
      {toastMessage && (
        <div className="toast z-50">
          <div className={`alert alert-${toastType}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5 overflow-x-hidden z-0 max-h-[600px]">
        {commentsArray.map((comment) => (
          <MyComment
            comment={comment}
            key={comment.id}
            onSuccess={(msg) => showToast(msg, "success")}
            onError={(msg) => showToast(msg, "error")}
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
