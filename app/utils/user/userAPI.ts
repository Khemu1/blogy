import { LoginFormProps, RegisterFormProps } from "@/app/types";
import { CustomError } from "@/middlewares/error/CustomError";
import { handleResponse } from "../blog/blogAPI";

export const loginUser = async (data: LoginFormProps) => {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const addUser = async (data: RegisterFormProps) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getMyInfo = async () => {
  try {
    const response = await fetch(`/api/users/myInfo`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const validateUser = async () => {
  try {
    const response = await fetch(`/api/validate-user`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};
