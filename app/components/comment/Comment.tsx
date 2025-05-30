import { CommentProps } from "@/app/types";
import React from "react";
import Image from "next/image";
const Comment: React.FC<{ commentData: CommentProps; last: boolean }> = ({
  commentData,
  last,
}) => {
  return (
    <div
      className={`flex gap-4 items-center pb-4  ${last ? "" : "border-b-2"}`}
    >
      <div className="flex items-start bg-base-200 rounded-full p-1 hover:bg-base-100">
        <Image
          src={"/assets/icons/user.svg"}
          alt="User Image"
          width={32}
          height={32}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <span className="text-xl font-semibold">
          {commentData.user.username}
        </span>
        <p>{commentData.content}</p>
      </div>
    </div>
  );
};

export default Comment;
