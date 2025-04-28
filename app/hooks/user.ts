import { useCallback, useEffect, useState } from "react";
import { addUser, getMyInfo, loginUser } from "../../utils/user/userAPI";
import {
  LoginFormProps,
  RegisterFormProps,
  LoginErrorProps,
  RegisterErrorProps,
  MyInfoProps,
} from "@/types";
import { isLoginError, isRegisterError } from "@/utils/user";

export const useAddUser = () => {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<RegisterErrorProps | null>(null);
  const handleAddUser = async (data: RegisterFormProps) => {
    try {
      await addUser(data);
    } catch (error) {
      if (isRegisterError(error)) {
        seterror(error);
      } else {
        seterror({ message: "Registration failed" });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleAddUser, loading, error };
};

export const useLoginUser = () => {
  const [loading, setloading] = useState(true);
  const [error, setError] = useState<LoginErrorProps | null>(null);
  const handleLoginUser = async (data: LoginFormProps) => {
    try {
      await loginUser(data);
    } catch (error) {
      if (isLoginError(error)) {
        setError(error);
      } else {
        setError({ message: "Login failed" });
      }
    } finally {
      setloading(false);
    }
  };
  return { handleLoginUser, loading, error };
};

export const useGetMyInfo = () => {
  const [data, setData] = useState<MyInfoProps | null>(null);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState<LoginErrorProps | null>(null);
  const haneGetMyInfo = useCallback(async () => {
    try {
      setData(await getMyInfo());
    } catch (error) {
      if (isLoginError(error)) {
        setError(error);
      } else {
        setError({ message: "Login failed" });
      }
    } finally {
      setloading(false);
    }
  }, []);

  return { haneGetMyInfo, loading, error, data };
};
