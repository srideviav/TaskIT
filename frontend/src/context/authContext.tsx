"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { setAuthToken } from "../lib/axios";

interface IUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface Auth {
  user: IUser | null;
  loading: boolean;
  login: (user: IUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<Auth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setAuthToken(parsedUser.token);
  }
  setLoading(false);
}, []);

  const login = (user: IUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setAuthToken(user.token);
   };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};