import { UserProps } from "@/types";

export const getUser = async (id: number): Promise<UserProps | undefined> => {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
