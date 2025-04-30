import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useUserStoreActions } from "../store/user";
import {
  RegisterErrorProps,
  RegisterFormProps,
  LoginErrorProps,
  LoginFormProps,
  MyInfoProps,
} from "../types";
import { isRegisterError, isLoginError } from "../utils/user";
import {
  addUser,
  loginUser,
  getMyInfo,
  validateUser,
} from "../utils/user/userAPI";
import { storeUserData } from "../utils";
import { CustomError } from "@/middlewares/error/CustomError";

export const authenticatedPaths = ["/blogs/newBlog"];

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
  const [data, setData] = useState<MyInfoProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, string> | null>(null);

  const handleGetMyInfo = useCallback(async () => {
    try {
      setData(await getMyInfo());
    } catch (error) {
      if (error instanceof CustomError) {
        setError(error.errors);
      } else {
        setError({ message: "An unknown error occurred while fetching info" });
      }
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { handleGetMyInfo, loading, error, data };
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
