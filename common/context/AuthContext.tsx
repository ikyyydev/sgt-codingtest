"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";
interface AuthContextProps {
  user: User | null;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    sessionStorage.removeItem("user");
  };

  const getToken = async () => {
    return user ? await user.getIdToken() : null;
  };

  return (
    <AuthContext.Provider value={{ user, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("UseAuth must be used within an AuthProvider");
  }
  return ctx;
};
