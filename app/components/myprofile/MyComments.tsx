import { MyProfileComments } from "@/types";
import React, { useState } from "react";
import MyComment from "./MyComment";
import { useDeleteComment } from "@/app/hooks/comment";

const MyComments: React.FC<{ comments: MyProfileComments[] | [] }> = ({
  comments,
}) => {
  const [AllComments, setAllComments] = useState<MyProfileComments[] | []>(
    comments || []
  );
  const { error, loading, handleDeleteComment } = useDeleteComment();

  const handleDelete = async (commentId: number) => {
    try {
      await handleDeleteComment(commentId);
      setAllComments(AllComments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center m-auto">
        <span className="loading loading-spinner w-[8rem]"></span>
      </div>
    );
  }

  if (AllComments.length < 1) {
    return <div>No comments yet, start making some!</div>;
  }

  return (
    <div className="relative h-full">
      <div className="flex flex-col gap-5 h-full overflow-y-scroll overflow-x-hidden z-0">
        {AllComments.map((comment) => (
          <MyComment
            comment={comment}
            key={comment.id}
            deleteComment={handleDelete} // Assuming a delete functionality
          />
        ))}
      </div>
      {/* Loading Spinner */}
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
