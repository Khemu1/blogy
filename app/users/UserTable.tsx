import React from "react";
import { User } from "../../types/index";
import { sort } from "fast-sort";
import Link from "next/link";

const UserTable: React.FC<{
  users: User[];
  SortBy: string;
}> = ({ users, SortBy }) => {
  const sortedUsers = sort(users).asc(
    SortBy === "email" ? (user) => user.email : (user) => user.name
  );
  return (
    <>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>
              <Link href={`/users?SortBy=name`}>Name</Link>
            </th>
            <th>
              <Link href={`/users?SortBy=email`}>Email</Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <Link href={`/users/${user.id}`}> {user.name}</Link>
              </td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserTable;
