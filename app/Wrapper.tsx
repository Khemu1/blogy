"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useUserStoreActions } from "./store/user";
import { useValidateUser } from "./hooks/user";
import { useToast } from "./store/toast";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setUser } = useUserStoreActions();
  const { message, type, open, closeToast } = useToast();

  useEffect(() => {
    console.log("wrapper useEffect");
    const checkUserData = () => {
      const storedUser = localStorage.getItem("userData");

      try {
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id > 0) {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error parsing user data", error);
        router.push("/login");
      }
    };

    checkUserData();
  }, [router, setUser]);

  useValidateUser();

  return (
    <>
      <main className="flex flex-col flex-1">{children}</main>

      {open && (
        <div className="toast z-50">
          <div
            className={`alert 
            ${type === "error" ? "alert-error" : "alert-success"}
            `}
          >
            <span>{message}</span>
            <button onClick={closeToast} className="ml-2 font-bold">
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Wrapper;
