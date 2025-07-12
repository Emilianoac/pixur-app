import { create } from "zustand";
import { onAuthStateChanged, Unsubscribe, type User } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, realTimeDB } from "@/firebaseConfig";
import type { userData } from "@/types";

interface AuthState {
  isLogged: boolean;
  user: User | null;
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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        set({
          isLogged: true,
          user: u,
          loading: false,
        });

        const userRef = ref(realTimeDB, `users/${u.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          set({ userData: data });
        });
      } else {
        set({
          isLogged: false,
          user: null,
          userData: null,
          loading: false,
        });
      }
    });

    return unsubscribe;
  },
}));
