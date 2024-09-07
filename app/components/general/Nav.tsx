import React from "react";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
  return (
    <div className="w-full flex justify-between navbar bg-base-200 py-4">
      <div className="flex justify-start relative">
        <Link href={"/"} className="">
          <Image
            alt="About Blogy"
            src="/assets/imgs/logo.svg"
            className="rounded-lg w-[140px] h-auto btn p-3 hover:bg-[#0000002c]"
            width={150}
            height={50}
          />
        </Link>
      </div>
      <div className="flex-none gap-2">
        <Link
          className="px-4 py-2 rounded-md bg-[#eb512b] border-none text-white hover:bg-base-300 transition-all"
          href={"/blogs/newBlog"}
        >
          New Blog
        </Link>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn hover:bg-[#0000002c] btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                src={"/assets/icons/user.svg"}
                className="w-[32px] h-[32px]"
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
  );
};

export default Nav;
