import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("trrip_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/auth/me")
        .then((r) => setUser(r.data.user))
        .catch(() => localStorage.removeItem("trrip_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("trrip_token", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("trrip_token", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("trrip_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
