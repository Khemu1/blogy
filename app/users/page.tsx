import React from "react";
import { User } from "../../types/index";
import UserTable from "./UserTable";
import Link from "next/link";

interface UserPageProps {
  searchParams: { SortBy: string };
}

const UsersPage: React.FC<UserPageProps> = async ({
  searchParams: { SortBy },
}) => {
  const response = await fetch("http://localhost:3000/api/users", {
    next: { revalidate: 10 },
  });

  const users: User[] = await response.json();
  return (
    <div className="flex flex-col gap-2 text-black my-5">
      <h1>Users</h1>
      <Link href="/users/new" className="btn  w-fit ">
        New User
      </Link>
      <UserTable users={users} SortBy={SortBy} />
      <div>{SortBy}</div>
    </div>
  );
};

export default UsersPage;
