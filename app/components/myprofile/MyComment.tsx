import { MyProfileComments } from "@/app/types";
import Link from "next/link";
import React from "react";

const MyComment: React.FC<{
  comment: MyProfileComments;
  deleteComment: (id: number) => Promise<void>;
}> = ({ comment, deleteComment }) => {
  return (
    <div className="flex w-full justify-between gap-4 bg-base-200 rounded-lg px-4 sm:px-6 py-3 hover:bg-base-100 transition-all items-start">
      <Link href={`/blogs/${comment.id}`} className="flex-1 min-w-0">
        <h2 className="block text-left font-semibold text-lg sm:text-xl truncate">
          {comment.content}
        </h2>
      </Link>

      <div className="flex gap-2 flex-shrink-0 whitespace-nowrap">
        <button
          type="button"
          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
        >
          Edit
        </button>
        <button
          type="button"
          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
          onClick={() => deleteComment(comment.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyComment;
