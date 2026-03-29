import { createContext, useContext, useState,  useEffect } from "react";
import type {ReactNode } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 🔥 Custom hook (important)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🔥 Load from localStorage on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // reconnect socket
      connectSocket(storedToken);
    }
  }, []);

  // 🔐 Login
  const login = (data: { user: User; token: string }) => {
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔥 connect socket
    connectSocket(data.token);
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // 🔥 disconnect socket
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};