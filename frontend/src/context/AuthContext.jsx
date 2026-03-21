import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(() => localStorage.getItem("exora_token"));
  const [loading, setLoading] = useState(true);

  // Rehydrate user from stored token on mount
  useEffect(() => {
    const stored = localStorage.getItem("exora_token");
    if (!stored) { setLoading(false); return; }

    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else logout();
      })
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (userData, tok) => {
    setUser(userData);
    setToken(tok);
    localStorage.setItem("exora_token", tok);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    saveSession(data.user, data.token);
    return data.user;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    saveSession(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("exora_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
