import { create } from "zustand";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  open: boolean;
  setToast: (message: string, type: ToastType, duration?: number) => void;
  closeToast: () => void;
}

let timeoutId: NodeJS.Timeout | null = null;

const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "info",
  open: false,

  setToast: (message, type, duration = 3000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    set({ message, type, open: true });

    timeoutId = setTimeout(() => {
      set({ message: "", type: "info", open: false });
      timeoutId = null;
    }, duration);
  },

  closeToast: () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    set({ message: "", type: "info", open: false });
  },
}));

export const useToast = () => {
  const { message, type, open, setToast, closeToast } = useToastStore();
  return { message, type, open, setToast, closeToast };
};
