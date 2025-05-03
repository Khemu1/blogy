"use client";
import Link from "next/link";
import Image from "next/image";
import { Rss } from "lucide-react";
import MobileMenu from "./MobileNav";
import ProfileDropdown from "./ProfileDropdown";
import { useUserStore } from "@/app/store/user";

export default function Nav() {
  const user = useUserStore((state) => state);

  return (
    <nav className="w-full navbar bg-base-200 py-4 px-4 lg:px-8 h-[87px]">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <Link href="/">
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
          <MobileMenu user={user} />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            className="btn bg-[#eb512b] border-none text-white hover:bg-[#d44926] transition-all"
            href={user ? "/blogs/newBlog" : "/login"}
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

          <ProfileDropdown user={user} />
        </div>
      </div>
    </nav>
  );
}
