import {create} from "zustand";

interface LoaderStore {
  isLoading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  isLoading: false,
  message: "",
  showLoader: (message = "Loading...") => set({isLoading: true, message}),
  hideLoader: () => set({isLoading: false, message: ""}),
}))