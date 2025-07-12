import { ref, onValue } from "firebase/database";
import { realTimeDB } from "@/firebaseConfig";
import type { userData } from "@/types";

export function subscribeToUserData(
  uid: string,
  callback: (data: userData | null) => void
): void {
  const userRef = ref(realTimeDB, `users/${uid}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}
