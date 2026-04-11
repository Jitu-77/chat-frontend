import { createContext, useContext, useState,  useEffect } from "react";
import type {ReactNode } from "react";
import { connectSocket, disconnectSocket ,getSocket} from "../socket/socket";
import { refreshAccessToken } from "../utility/refreshToken";

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
    const storedToken = localStorage.getItem("accessToken")|| false;
    const storedUser = localStorage.getItem("user")|| false;

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // ✅ connect only if not already connected
      if (!getSocket()) {
        connectSocket(storedToken);
      }
    }
  }, []);

  // 🔐 Login
  const login = (data: { user: User; token: string }) => {
    setUser(data.user);
    setToken(data.token);
    if(data?.token){
      localStorage.setItem("accessToken", data.token);
    }
    if(data?.user){
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    // ✅ reset socket before reconnect
    disconnectSocket();
    connectSocket(data.token)
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.clear();
    console.log("Logout towards socket disconnect");
    // 🔥 disconnect socket
    disconnectSocket();
  };
  // 🔥 AUTO REFRESH TOKEN
  useEffect(() => {
    console.log("In token");
    if (!token) return;

    const interval = setInterval(async () => {
    const newToken = await refreshAccessToken();

      if (newToken) {
        setToken(newToken);
        localStorage.setItem("accessToken", newToken);
        // ✅ reconnect cleanly
        disconnectSocket();
        connectSocket(newToken);
      }
    }, 12 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};