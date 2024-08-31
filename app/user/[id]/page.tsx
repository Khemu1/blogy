import React from "react";
import { UserProps } from "../../../types/index";
import Link from "next/link";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: { id: number }; // it must be named params
}

const UsersPage: React.FC<UserPageProps> = async ({ params: { id } }) => {
  if (id > 4) {
    return notFound();
  }
  return (
    <div className="flex flex-col gap-2 text-black my-5">
      <h1 className="text-2xl mb-5">Welcome Back User</h1>
      <div className="flex flex-col gap-5">
        <p>
          Username: <span>something</span>
        </p>
        <p>
          {" "}
          Role: <span>Role</span>
        </p>
        <p>
          <Link href={`/user/${id}/myblogs`}>Your Blogs {id}</Link>
        </p>
      </div>
    </div>
  );
};

export default UsersPage;
