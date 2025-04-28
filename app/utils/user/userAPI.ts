import { LoginFormProps, RegisterFormProps } from "@/app/types";

export const loginUser = async (data: LoginFormProps) => {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const addUser = async (data: RegisterFormProps) => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMyInfo = async () => {
  try {
    const response = await fetch(`/api/users/myInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      let errorMessage = { message: "Unexpected Error" };
      try {
        const errorData: { message: string } = await response.json();
        errorMessage = errorData || errorMessage;
      } catch (error) {
        console.error("Error parsing response:", error);
        throw error;
      }
      throw errorMessage;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
