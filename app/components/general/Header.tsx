import React from "react";
import SearchBar from "./SearchBar";
import Filter from "./Filter";

const Header = () => {
  return (
    <div className=" flex flex-wrap max-w-[400px] sm:max-w-[unset] items-center justify-center sm:justify-between gap-5 navbar bg-base-200 p-4 py-6 rounded-lg">
      <SearchBar />
      <Filter />
    </div>
  );
};

export default Header;
