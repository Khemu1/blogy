import React from "react";
import Link from "next/link";

const Nav = () => {
  return (
    <>
      <nav className="flex text-black px-5 p-2 justify-between w-full bg-slate-300 items-center">
        <h1 className="font-extrabold text-2xl">BLOGY</h1>
        <ul className="flex gap-4 list-none items-center font-semibold">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blogs/newBlog">New Blog</Link>
          </li>{" "}
          <li>
            <Link href="/user/user">username</Link>
          </li>
          <li>
            <button
              className="bg-slate-100 px-3 py-1 rounded-lg hover:bg-white transition-all"
              type="button"
            >
              Logout
            </button>
          </li>{" "}
        </ul>
      </nav>
    </>
  );
};

export default Nav;
