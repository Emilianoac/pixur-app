import { auth, realTimeDB } from "@/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import type { User } from "firebase/auth";


async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const data = await signInWithEmailAndPassword(auth, email, password)
    return data.user as User;
  } catch (error) {
    console.error(error)
    return null;
  }
}

async function signUp(email: string, password: string): Promise<User | null> {
  try {
    const data = await createUserWithEmailAndPassword(auth, email, password)
    
    await set(ref(realTimeDB, `users/${data.user.uid}`), {
      email: data.user.email,
      uid: data.user.uid,
    });
    return data.user as User;
    
  } catch (error) {
    console.error(error)
    return null;
  }
}

export { signIn, signUp, auth};

