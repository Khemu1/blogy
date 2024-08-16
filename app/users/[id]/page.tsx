"use client";
import { notFound } from "next/navigation";
import React from "react";
import { useGetUser } from "@/hooks/user";

interface UserPageProps {
  params: { id: number };
}

const UserPage: React.FC<UserPageProps> = ({ params: { id } }) => {
  const userId = Number(id);
  if (isNaN(userId) || userId <= 0) {
    return notFound();
  }

  const { error, user, loading } = useGetUser(userId);
  console.log(error);

  if (loading) {
    return (
      <span className="flex justify-center m-auto items-center h-full w-[10%] loading loading-ring"></span>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-2xl font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 my-8">
      <h1>user Info</h1>
      <div className="ml-3">
        <div className="">
          <span className="font-semibold">Username : </span>
          {user?.name}
        </div>
        <span className="font-semibold">Email : </span>
        {user?.email}
      </div>
    </div>
  );
};

export default UserPage;
