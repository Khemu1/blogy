"use client";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-full text-2xl font-extrabold">
      Blog Not Found
      <button
        onClick={() => window.location.reload()}
        className="bg-slate-200 px-3 py-1 hover:bg-blue-500 hover:text-white transition-all rounded-lg text-2xl"
      >
        Retry
      </button>
    </div>
  );
};

export default NotFoundPage;
