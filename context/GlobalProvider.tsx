import React, { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { realTimeDB } from "@/firebaseConfig";

import type { User } from "firebase/auth";
import type { userData } from "@/types";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  userData: userData | null;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const GlobalContext = createContext<GlobalContextProps | null>(null);
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Verify if the user is logged in
    const unsuscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setIsLogged(true);
        setUser(u as User);
        console.log("User logged in");
        setLoading(false);
      } else {
        setIsLogged(false);
        setUser(null);
        console.log("User logged out");
        setLoading(false);
      }
    });

    // Clean the listener when the component is unmounted
    return () => unsuscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Read user data from the database
      async function readUserData(uid: string) {
        const userRef = ref(realTimeDB, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserData(data);
        });
      }
      readUserData(user.uid);
    }
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        userData,
        setUserData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};


export default GlobalProvider;
