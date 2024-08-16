import { useEffect, useState } from "react";
import { getUser } from "../utils/user/userAPI";
import { UserProps } from "@/types";

export const useGetUser = (id: number | null) => {
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<String | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "number") {
      console.log(id);
      console.log(typeof id);
      return;
    }
    try {
      console.log(id);
      console.log(typeof id);
      const fetchUser = async () => {
        const fetchedUser = await getUser(id);
        setUser(fetchedUser);
      };
      fetchUser();
    } catch (error) {
      seterror(error instanceof Error ? error.message : "Failed to fetch user");
    } finally {
      setloading(false);
    }
  }, [id]);
  return { user, loading, error };
};
