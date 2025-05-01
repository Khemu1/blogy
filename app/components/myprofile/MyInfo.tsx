import { UserProps } from "@/app/types";
import React from "react";

const MyInfo: React.FC<{ data: UserProps }> = ({ data }) => {
  return (
    <div className="flex flex-col justify-around h-full">
      <div className="account_info   mb-4">
        <label htmlFor="username" className="mb-2 text-lg font-semibold">
          Name:
        </label>
        <input
          id="username"
          type="text"
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#eb512b]"
          defaultValue={data.username}
          readOnly
        />
      </div>

      <div className="account_info  mb-4">
        <label htmlFor="email" className="mb-2 text-lg font-semibold">
          Email:
        </label>
        <input
          id="email"
          type="email"
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#eb512b]"
          defaultValue={data.email}
          readOnly
        />
      </div>

      <div className="account_info   mb-4">
        <label
          htmlFor="createdAt"
          className=" items-end mb-2 text-lg font-semibold"
        >
          Created At:
        </label>
        <input
          id="createdAt"
          type="text"
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#eb512b]"
          defaultValue={new Date(data.createdAt).toLocaleDateString()}
          readOnly
        />
      </div>

      <div className="account_info   mb-4">
        <label htmlFor="password" className="mb-2 text-lg font-semibold">
          Password:
        </label>
        <input
          id="password"
          type="password"
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#eb512b]"
          defaultValue="●●●●●●●●"
          readOnly
        />
      </div>
    </div>
  );
};

export default MyInfo;
