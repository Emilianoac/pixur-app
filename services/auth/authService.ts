import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export function subscribeToAuthState(callback: (user: User | null) => void ): () => void {
  return onAuthStateChanged(auth, callback);
}