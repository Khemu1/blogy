import { create } from "zustand";

interface UserState {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  setUser: (user: UserState) => void;
}

// Creating the store
export const useUserStore = create<UserState>((set) => ({
  id: 0,
  username: "",
  email: "",
  createdAt: "",
  updatedAt: "",
  setUser: (user) => set({ ...user }),
}));

export const useUserStoreActions = () => {
  const setUser = useUserStore((state) => state.setUser);
  return setUser;
};
