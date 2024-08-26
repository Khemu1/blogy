import React from "react";
import Link from "next/link";

const Nav = () => {
  return (
    <>
      <nav className="flex text-black p-2 justify-between w-full bg-slate-300 items-center">
        <h1 className="font-extrabold text-2xl">BLOGY</h1>
        <ul className="flex gap-2 list-none">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/user/my-blogs">My Blogs</Link>
          </li>{" "}
          <li>
            <Link href="/">Logout</Link>
          </li>{" "}
        </ul>
      </nav>
    </>
  );
};

export default Nav;
