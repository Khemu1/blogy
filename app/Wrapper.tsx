"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useUserStoreActions } from "./store/user";
import { useValidateUser } from "./hooks/user";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setUser } = useUserStoreActions();
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
  }, [router]);
  useValidateUser();
  return <main className="flex flex-col gap-3  flex-1">{children}</main>;
};

export default Wrapper;
