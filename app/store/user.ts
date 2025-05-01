import { create } from "zustand";
import { MyProfileBlogs, MyProfileComments } from "../types";

type CommentMap = Record<number, MyProfileComments>;
type BlogMap = Record<number, MyProfileBlogs>;

interface UserState {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  myComments: CommentMap;
  myBlogs: BlogMap;
  setUser: (
    user: Omit<
      UserState,
      | "setUser"
      | "setMyComments"
      | "setMyBlogs"
      | "editComment"
      | "editBlog"
      | "reset"
    >
  ) => void;
  setMyComments: (comments: MyProfileComments[]) => void;
  setMyBlogs: (blogs: MyProfileBlogs[]) => void;
  editComment: (commentId: number, newContent: string) => void;
  editBlog: (blogId: number, newTitle: string, newContent: string) => void;
  deleteComment: (commentId: number) => void;
  deleteBlog: (blogId: number) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  id: 0,
  username: "",
  email: "",
  createdAt: "",
  updatedAt: "",
  myComments: {},
  myBlogs: {},
  setUser: (user) => set({ ...user }),
  setMyComments: (comments) => {
    const map: CommentMap = {};
    comments.forEach((c) => {
      map[c.id] = c;
    });
    set({ myComments: map });
  },
  setMyBlogs: (blogs) => {
    const map: BlogMap = {};
    blogs.forEach((b) => {
      map[b.id] = b;
    });
    set({ myBlogs: map });
  },

  editComment: (commentId, newContent) => {
    const { myComments } = get();
    if (!myComments[commentId]) return;
    set({
      myComments: {
        ...myComments,
        [commentId]: {
          ...myComments[commentId],
          content: newContent,
        },
      },
    });
  },

  editBlog: (blogId, newTitle, newContent) => {
    const { myBlogs } = get();
    if (!myBlogs[blogId]) return;
    set({
      myBlogs: {
        ...myBlogs,
        [blogId]: {
          ...myBlogs[blogId],
          title: newTitle,
          content: newContent,
        },
      },
    });
  },
  deleteComment: (commentId) => {
    const { myComments } = get();
    if (!myComments[commentId]) return;

    const { [commentId]: _, ...rest } = myComments;
    set({ myComments: rest });
  },

  deleteBlog: (blogId) => {
    const { myBlogs } = get();
    if (!myBlogs[blogId]) return;

    const { [blogId]: _, ...rest } = myBlogs;
    set({ myBlogs: rest });
  },

  reset: () =>
    set({
      id: 0,
      username: "",
      email: "",
      createdAt: "",
      updatedAt: "",
      myComments: {},
      myBlogs: {},
    }),
}));

export const useUserStoreActions = () => {
  const setUser = useUserStore((state) => state.setUser);
  const reset = useUserStore((state) => state.reset);
  const setMyComments = useUserStore((state) => state.setMyComments);
  const setMyBlogs = useUserStore((state) => state.setMyBlogs);
  const editComment = useUserStore((state) => state.editComment);
  const editBlog = useUserStore((state) => state.editBlog);
  const deleteComment = useUserStore((state) => state.deleteComment);
  const deleteBlog = useUserStore((state) => state.deleteBlog);
  return {
    setUser,
    reset,
    setMyComments,
    setMyBlogs,
    editComment,
    editBlog,
    deleteComment,
    deleteBlog,
  };
};
