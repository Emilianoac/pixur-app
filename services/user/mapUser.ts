import type { AppUser } from "@/types/user";
import type { User } from "firebase/auth";

const mapFirebaseUserToAppUser = (firebaseUser: User): AppUser => ({
  id: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

export { mapFirebaseUserToAppUser };