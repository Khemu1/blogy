import React from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

const Nav = () => {
  return (
    <>
      <div className="navbar bg-base-200 py-4">
        <div className="flex-1">
          <Link
            href={"/"}
            className="btn btn-ghost text-secondary font-extrabold text-4xl"
          >
            Blogy
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  src={"/assets/icons/user.svg"}
                  width={32}
                  height={32}
                  alt="User Profile"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href={"/users"} className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
