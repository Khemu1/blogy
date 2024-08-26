import { useEffect, useState } from "react";
import { addUser, loginUser } from "../utils/user/userAPI";
import { LoginFormProps, RegisterFormProps, UserProps } from "@/types";

export const useAddUser = () => {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<String | null>(null);
  const handleAddUser = async (data: RegisterFormProps) => {
    try {
      await addUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  return { handleAddUser, loading, error };
};

export const useLoginUser = () => {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<String | null>(null);
  const handleLoginUser = async (data: LoginFormProps) => {
    try {
      await loginUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  return { handleLoginUser, loading, error };
};
