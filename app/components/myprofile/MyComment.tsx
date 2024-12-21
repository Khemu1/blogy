import { MyProfileComments } from "@/types";
import Link from "next/link";
import React from "react";

const MyComment: React.FC<{
  comment: MyProfileComments;
  deleteComment: (id: number) => Promise<void>;
}> = ({ comment, deleteComment }) => {
  return (
    <div className="flex max-w-full justify-between gap-2 bg-base-200 rounded-lg px-3 py-4 cursor-pointer hover:bg-base-100 transition-all overflow-hidden">
      {/* Left Child (Title/Link) with a fixed width */}
      <Link
        href={`/blogs/${comment.id}`}
        key={comment.id}
        className="flex-1 max-w-full  text_overflow"
      >
        <h2 className="block text-left font-semibold text-xl sm:text-2xl my_blog_title ">
          {comment.content}
        </h2>
      </Link>

      {/* Right Child (Buttons) with a fixed width */}
      <div className="flex gap-3 justify-end font-semibold">
        <button
          type="button"
          className="bg-blue-500 text-white px-2 rounded-lg"
        >
          Edit
        </button>
        <button
          type="button"
          className="bg-red-600 text-white px-2 rounded-lg"
          onClick={() => deleteComment(comment.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyComment;
