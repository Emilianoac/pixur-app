import { onAuthStateChanged, type User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set,  } from "firebase/database";
import { auth, realTimeDB } from "@/firebaseConfig";

export async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const data = await signInWithEmailAndPassword(auth, email, password)
    return data.user as User;
  } catch (error) {
    console.error(error);
    throw new Error(error instanceof Error ? error.message : "Sign-in failed");
  }
}

export async function signUp(email: string, password: string): Promise<User | null> {
  try {
    const data = await createUserWithEmailAndPassword(auth, email, password)
    
    await set(ref(realTimeDB, `users/${data.user.uid}`), {
      email: data.user.email,
      uid: data.user.uid,
    });
    return data.user as User;
    
  } catch (error) {
    console.error(error);
    throw new Error(error instanceof Error ? error.message : "Sign-up failed");
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void ): () => void {
  return onAuthStateChanged(auth, callback);
}