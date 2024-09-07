import { useEffect, useState } from "react";
import { BlogFilter } from "@/constants";
import { useSearchParams } from "next/navigation";

const Filter = () => {
  const [data, setData] = useState(BlogFilter[0]);
  const searchParams = useSearchParams();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value; // Using `value` instead of `id`
    const AllsearchParams = new URLSearchParams(window.location.search);

    if (value.toLowerCase() === data.value.toLowerCase()) {
      return; // Exit if the filter is the same
    }

    const selectedFilter = BlogFilter.find((f) => f.value === value);
    setData(selectedFilter ?? BlogFilter[0]);

    AllsearchParams.set(
      "sortBy",
      (selectedFilter?.value ?? BlogFilter[0].value).toLowerCase()
    );

    const newUrl = `${window.location.pathname}?${AllsearchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    const sortBy = searchParams.get("sortBy");
    if (sortBy) {
      setData(
        BlogFilter.find((f) => f.value.toLowerCase() === sortBy) ??
          BlogFilter[0]
      );
    } else {
      setData(BlogFilter[0]);
    }
  }, [searchParams]);

  return (
    <div className="dropdown rounded-none bg-transparent">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 bg-base-100 rounded-md text-[11px] sm:text-[16px]"
      >
        Sort By : {data.name}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content text-center bg-base-200 menu rounded-box z-[1] w-52 p-2 shadow"
      >
        {BlogFilter.map((f) => (
          <button
            className={`rounded-lg py-1  ${
              f.value.toLowerCase() === data.value.toLowerCase()
                ? "bg-[#f35b35] text-white"
                : "bg-transparent hover:bg-base-300"
            }`}
            type="button"
            key={f.value}
            value={f.value}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleOnClick(e)
            }
          >
            {f.name}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
