"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/app/store/user";
import { useRouter } from "next/navigation";
import { CircleUser, Menu, Rss } from "lucide-react";

const Nav = () => {
  const userStore = useUserStore((state) => state);
  const routeTo = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    console.log(userStore);
  }, [userStore.id]);

  const handleMenuToggle = () => {
    setTimeout(() => {
      setIsMenuOpen(!isMenuOpen);
    }, 100);
  };

  const handleProfileClick = () => {
    if (userStore.id > 0) {
      routeTo.push("/myprofile");
    } else {
      routeTo.push("/login");
    }
  };

  return (
    <nav className="w-full navbar bg-base-200 py-4 px-4 lg:px-8">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <Link href={"/"}>
            <Image
              alt="About Blogy"
              src="/assets/imgs/logo.svg"
              className="rounded-lg w-[140px] h-auto hover:bg-[#0000002c] transition-all"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            className="btn btn-ghost p-2"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            className="btn bg-[#eb512b] border-none text-white hover:bg-[#d44926] transition-all"
            href={`${userStore.id > 0 ? "/blogs/newBlog" : "/login"}`}
          >
            New Blog
          </Link>

          <Link
            className="btn bg-[#eb512b] border-none text-white hover:bg-[#d44926] transition-all flex items-center gap-2"
            href="/blogs"
          >
            <Rss />
            Blogs
          </Link>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost hover:bg-[#0000002c] flex items-center gap-2"
              onClick={handleProfileClick}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="rounded-full">
                <CircleUser />{" "}
              </div>
              {userStore.id > 0 && (
                <span className="text-sm">{userStore.username}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute right-3 top-10 bg-gray-700  rounded-md z-[9999]  mt-4 p-4">
          <div className="flex flex-col gap-3">
            <Link
              className="btn bg-[#eb512b] border-none text-white hover:bg-[#d44926] transition-all w-full"
              href={`${userStore.id > 0 ? "/blogs/newBlog" : "/login"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              New Blog
            </Link>

            <Link
              className="btn bg-[#eb512b] border-none text-white hover:bg-[#d44926] transition-all w-full flex items-center justify-center gap-2"
              href="/blogs"
              onClick={() => setIsMenuOpen(false)}
            >
              <Rss /> Blogs
            </Link>

            <div className="flex justify-center">
              <button
                className="btn btn-ghost hover:bg-[#0000002c] flex items-center gap-2"
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
              >
                <CircleUser size={24} />
                {userStore.id > 0 && (
                  <span className="text-sm max-w-[75px] truncate">
                    {userStore.username}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
