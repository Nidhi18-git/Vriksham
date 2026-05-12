import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("vriksham_user");
    const token = localStorage.getItem("vriksham_token");
    if (!stored || !token) return null;

    try {
      return JSON.parse(stored);
    } catch (_error) {
      localStorage.removeItem("vriksham_user");
      localStorage.removeItem("vriksham_token");
      return null;
    }
  });

  useEffect(() => {
    const handleExpiredAuth = () => setUser(null);
    window.addEventListener("vriksham-auth-expired", handleExpiredAuth);
    return () => window.removeEventListener("vriksham-auth-expired", handleExpiredAuth);
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/login", payload);
    localStorage.setItem("vriksham_token", data.token);
    localStorage.setItem("vriksham_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/signup", payload);
    localStorage.setItem("vriksham_token", data.token);
    localStorage.setItem("vriksham_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("vriksham_token");
    localStorage.removeItem("vriksham_user");
    setUser(null);
  };

  const updateUser = (nextUser) => {
    localStorage.setItem("vriksham_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const isAuthenticated = Boolean(user && localStorage.getItem("vriksham_token"));
  const value = useMemo(() => ({ user, isAuthenticated, login, signup, logout, updateUser }), [user, isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
