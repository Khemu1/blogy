import { create } from "zustand";

interface UserState {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const useUserStore = create<UserState>((set) => ({
  id: 0,
  username: "",
  email: "",
  createdAt: "",
  updatedAt: "",
}));

export const useUserStoreActions = (set: any) => ({
  setUser: (user: UserState) => set(user),
});
