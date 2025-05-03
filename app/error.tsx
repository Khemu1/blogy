"use client";
import React from "react";

interface Props {
  error: Error;
  reset: () => void;
}

const ErrorPage: React.FC<Props> = ({ error, reset }) => {
  console.log("Error", error);
  return (
    <div className="h-full flex flex-col justify-center items-center text-3xl font-bold capitalize gap-3">
      <div>An unexpected error has occurred .</div>
      <button onClick={reset} className="btn">
        Retry
      </button>
    </div>
  );
};

export default ErrorPage;
