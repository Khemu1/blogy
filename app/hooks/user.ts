import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useUserStoreActions } from "../store/user";
import {
  RegisterErrorProps,
  RegisterFormProps,
  LoginErrorProps,
  LoginFormProps,
  MyInfoProps,
} from "../types";
import { isRegisterError, isLoginError } from "../utils/user";
import { addUser, loginUser, getMyInfo } from "../utils/user/userAPI";
import { storeUserData } from "../utils";

export const useAddUser = () => {
  const setUser = useUserStoreActions();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<RegisterErrorProps | null>(null);

  const handleAddUser = async (data: RegisterFormProps) => {
    try {
      setError(null);
      const res = await addUser(data);
      storeUserData(res.user);
      setUser(res.user);
      router.push("/blogs");
    } catch (error) {
      if (isRegisterError(error)) {
        setError(error);
      } else {
        setError({ message: "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleAddUser, loading, error };
};

export const useLoginUser = () => {
  const setUser = useUserStoreActions();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LoginErrorProps | null>(null);

  const handleLoginUser = async (data: LoginFormProps) => {
    try {
      setError(null);
      const res = await loginUser(data);
      storeUserData(res.user);
      setUser(res.user);
      router.push("/blogs");
    } catch (error) {
      if (isLoginError(error)) {
        setError(error);
      } else {
        setError({ message: "Login failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginUser, loading, error };
};

export const useGetMyInfo = () => {
  const setUser = useUserStoreActions();
  const router = useRouter();
  const [data, setData] = useState<MyInfoProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LoginErrorProps | null>(null);

  const handleGetMyInfo = useCallback(async () => {
    try {
      setData(await getMyInfo());
    } catch (error) {
      if (isLoginError(error)) {
        setError(error);
        router.push("/login");
      } else {
        setError({ message: "Login failed" });
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { handleGetMyInfo, loading, error, data };
};
