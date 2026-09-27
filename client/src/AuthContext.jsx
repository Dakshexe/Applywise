import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      async login(payload) {
        const data = await api("/api/auth/login", { method: "POST", body: payload, auth: false });
        setToken(data.token);
        setUser(data.user);
      },
      async register(payload) {
        const data = await api("/api/auth/register", { method: "POST", body: payload, auth: false });
        setToken(data.token);
        setUser(data.user);
      },
      logout() {
        setToken(null);
        setUser(null);
      },
      setUser,
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
