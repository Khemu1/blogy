
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUser, Menu, Rss } from "lucide-react";

export default function MobileMenu({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(user ? "/myprofile" : "/login");
    setIsMenuOpen(false);
  };

  return (
    <>
      <button
        className="btn btn-ghost p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu />
      </button>

      {isMenuOpen && (
        <div className="lg:hidden absolute right-3 top-10 bg-gray-700 rounded-md z-[9999] mt-4 p-4">
          <div className="flex flex-col gap-3">
            <Link
              className="btn bg-[#eb512b] border-none text-white hover:bg-[#d44926] transition-all w-full"
              href={user ? "/blogs/newBlog" : "/login"}
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
                className={`btn btn-ghost hover:bg-[#0000002c] flex justify-center items-center ${
                  user.id !== 0 && "gap-2"
                } `}
                onClick={handleProfileClick}
              >
                <CircleUser size={24} />
                {user.id !== 0 && (
                  <span className="text-sm max-w-[75px] truncate">
                    {user.username}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
