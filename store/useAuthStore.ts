import { create } from "zustand";
import { subscribeToAuthState } from "@/services/auth/authService";
import { subscribeToUserData } from "@/services/user/userService";
import { mapFirebaseUserToAppUser } from "@/services/user/mapUser";
import type { AppUser } from "@/types/user";
import type { userData } from "@/types";

interface AuthState {
  isLogged: boolean;
  user: AppUser | null;
  loading: boolean;
  userData: userData | null;
  setState: (partial: Partial<AuthState>) => void;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogged: false,
  user: null,
  loading: true,
  userData: null,

  setState: (partial) => set((state) => ({ ...state, ...partial })),

  initAuthListener: () => {
    const unsubscribe = subscribeToAuthState((u) => {
      if (u) {
        const appUser = mapFirebaseUserToAppUser(u);
        set({ isLogged: true, user: appUser, loading: false });

        subscribeToUserData(appUser.id, (data) => {
          set({ userData: data });
        });
      } else {
        set({ isLogged: false, user: null, userData: null, loading: false});
      }
    });

    return unsubscribe;
  },
}));
