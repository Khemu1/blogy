import React, { ReactNode } from "react";
import Nav from "../components/general/Nav";

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main className="flex flex-col gap-2 h-full">
      <div className="flex">
        <aside className="bg-slate-200 p-5 mr-5">Admin Sidebar</aside>
        <div>{children}</div>
      </div>
    </main>
  );
};

export default AdminLayout;
