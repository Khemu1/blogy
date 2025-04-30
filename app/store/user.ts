import { create } from "zustand";

interface UserState {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  setUser: (user: UserState) => void;
  reset: () => void;
}

// Creating the store
export const useUserStore = create<UserState>((set) => ({
  id: 0,
  username: "",
  email: "",
  createdAt: "",
  updatedAt: "",
  setUser: (user) => set({ ...user }),
  reset: () =>
    set({ id: 0, username: "", email: "", createdAt: "", updatedAt: "" }),
}));

export const useUserStoreActions = () => {
  const setUser = useUserStore((state) => state.setUser);
  const reset = useUserStore((state) => state.reset);
  return { setUser, reset };
};
