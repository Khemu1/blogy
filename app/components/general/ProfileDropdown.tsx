import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleUser } from "lucide-react";

export default function ProfileDropdown({ user }: { user: any }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    router.push(user ? "/myprofile" : "/login");
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost hover:bg-[#0000002c] flex justify-center items-center "
        onClick={handleProfileClick}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div className={`rounded-full flex items-center justify-center`}>
          <CircleUser />{" "}
        </div>
        {user.id !== 0 && <span className="text-sm">{user.username}</span>}
      </div>
    </div>
  );
}
