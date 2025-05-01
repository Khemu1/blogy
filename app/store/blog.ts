import { create } from "zustand";
import { AllBlogProps } from "../types";

interface BlogState {
  blog: AllBlogProps;
  setBlog: (blog: AllBlogProps) => void;
  reset: () => void;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blog: {
    id: 0,
    userId: 0,
    title: "",
    content: "",
    image: null,
    author: "",
    createdAt: "",
    updatedAt: "",
    user: { username: "" },
  },
  setBlog: (blog) => set({ blog }),
  reset: () =>
    set({
      blog: {
        id: 0,
        userId: 0,
        title: "",
        content: "",
        image: null,
        author: "",
        createdAt: "",
        updatedAt: "",
        user: { username: "" },
      },
    }),
}));

export const useBlogStoreActions = () => {
  const setBlog = useBlogStore((state) => state.setBlog);
  const reset = useBlogStore((state) => state.reset);
  return {
    setBlog,
    reset,
  };
};
