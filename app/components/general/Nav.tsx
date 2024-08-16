import React from "react";

const Nav = () => {
  return (
    <>
      <nav className="flex text-black p-2 justify-between w-full bg-slate-300">
        <div>Logo</div>
        <ul className="flex gap-2 list-none">
          <li>Home</li>
          <li>Contact</li>
          <li>About</li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
