"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const [data, setData] = useState("");
  const [searchBy, setSearchBy] = useState<string>("title");
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    const sb = searchParams.get("searchBy");
    if (q) {
      setData(q);
    }
    if (sb) {
      setSearchBy(sb.toLowerCase()); // Ensure the searchBy state is in lowercase
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(window.location.search);

    if (data.trim()) {
      searchParams.set("q", data.trim());
    } else {
      searchParams.delete("q");
    }

    if (searchBy) {
      searchParams.set("searchBy", searchBy.toLowerCase());
    } else {
      searchParams.delete("searchBy");
    }

    const newPathName = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    window.history.pushState({}, "", newPathName);
  };

  return (
    <form
      className="flex flex-1"
      onSubmit={(e: React.FormEvent) => handleSubmit(e)}
    >
      <div className="join w-full">
        <div className="flex flex-1">
          <input
            className="w-full input input-bordered join-item"
            placeholder="Search"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered join-item text-[11px] sm:text-[16px]"
          value={searchBy || ""}
          onChange={(e) => setSearchBy(e.target.value.toLowerCase())}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="content">Content</option>
        </select>
      </div>
    </form>
  );
};

export default SearchBar;
