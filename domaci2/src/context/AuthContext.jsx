import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { id, name, email, role, company, ... }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Učitaj /auth/me ako postoji token (reload stranice)
  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

const login = (userData, token) => {
  localStorage.setItem("token", token);
  setUser(userData);

  const role = String(userData?.role || "").trim().toLowerCase();

  if (role === "admin") {
    navigate("/admin", { replace: true });
  } else if (role === "supplier") {
    navigate("/supplier", { replace: true });
  } else if (role === "importer") {
    navigate("/importer", { replace: true });
  } else {
    // fallback ako backend vrati nešto neočekivano
    navigate("/", { replace: true });
  }
};

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth", { replace: true });
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}
