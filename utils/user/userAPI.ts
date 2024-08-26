import { LoginFormProps, RegisterFormProps } from "@/types";

export const loginUser = async (data: LoginFormProps) => {
  try {
    const response = await fetch(`/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const addUser = async (data: RegisterFormProps) => {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
