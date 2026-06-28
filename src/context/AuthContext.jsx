import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await apiRequest("/auth/me", { method: "GET" });
      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error.status === 401) {
        try {
          await apiRequest("/auth/refresh", { method: "POST", body: JSON.stringify({}) });
          const retried = await apiRequest("/auth/me", { method: "GET" });
          setUser(retried.user);
          return retried.user;
        } catch (_refreshError) {
          setUser(null);
          return null;
        }
      }
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signup = useCallback(async (payload) => {
    const data = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async (payload) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setUser(data.user);
    return data;
  }, []);

  const refresh = useCallback(async () => {
    const data = await apiRequest("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({})
    });
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/auth/logout", { method: "POST", body: JSON.stringify({}) });
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    await apiRequest("/auth/logout-all", { method: "POST", body: JSON.stringify({}) });
    setUser(null);
  }, []);

  const forgotPassword = useCallback((email) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  }, []);

  const resetPassword = useCallback((token, newPassword) => {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword })
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      fetchMe,
      signup,
      login,
      refresh,
      logout,
      logoutAll,
      forgotPassword,
      resetPassword
    }),
    [user, loading, fetchMe, signup, login, refresh, logout, logoutAll, forgotPassword, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
