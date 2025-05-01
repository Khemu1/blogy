import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useUserStoreActions } from "../store/user";
import { RegisterFormProps, LoginFormProps, UserProps } from "../types";
import {
  addUser,
  loginUser,
  getMyInfo,
  validateUser,
} from "../utils/user/userAPI";
import { storeUserData } from "../utils";
import { CustomError } from "@/middlewares/error/CustomError";

export const authenticatedPaths = ["/blogs/newBlog", "/myprofile"];

export const useAddUser = () => {
  const { setUser } = useUserStoreActions();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const handleAddUser = async (data: RegisterFormProps) => {
    try {
      setError(null);
      const res = await addUser(data);
      storeUserData(res.user);
      setUser(res.user);
      router.push("/blogs");
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error.errors);
      } else {
        setError({ message: "An unknown registration error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleAddUser, loading, error };
};

export const useLoginUser = () => {
  const { setUser } = useUserStoreActions();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const handleLoginUser = async (data: LoginFormProps) => {
    try {
      setError(null);
      const res = await loginUser(data);
      storeUserData(res.user);
      setUser(res.user);
      router.push("/blogs");
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error.errors);
      } else {
        setError({ message: "An unknown login error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginUser, loading, error };
};

export const useGetMyInfo = () => {
  const router = useRouter();
  const { setUser } = useUserStoreActions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const handleGetMyInfo = async () => {
    try {
      const data = await getMyInfo();
      setUser(data);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          console.log("error", error);
          router.push("/login");
        }
        setError(error.errors);
      } else {
        setError({ message: "An unknown error occurred while fetching info" });
      }
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return { handleGetMyInfo, loading, error };
};

export const useValidateUser = () => {
  const { reset } = useUserStoreActions();
  const pathname = usePathname();
  const router = useRouter();
  const handleValidateUser = async () => {
    try {
      await validateUser();
    } catch (error) {
      router.push("/login");
      if (typeof window !== "undefined") localStorage.removeItem("userData");
      reset();
    }
  };
  useEffect(() => {
    if (authenticatedPaths.includes(pathname)) handleValidateUser();
  }, [router, pathname]);
};
