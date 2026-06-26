import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Subscribe to Better Auth session hook
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();

  const syncJWT = async () => {
    setBootstrapping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include" // Must include credentials to share cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("JWT sync error:", err);
      setUser(null);
    } finally {
      setBootstrapping(false);
    }
  };

  useEffect(() => {
    const hydrateSession = async () => {
      if (sessionPending) {
        return;
      }

      if (sessionData) {
        await syncJWT();
        return;
      }

      setUser(null);
      setBootstrapping(false);
    };

    void hydrateSession();
  }, [sessionData, sessionPending]);

  const loading = sessionPending || bootstrapping;

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message || "Failed to log in");
    }
    await syncJWT();
    return data;
  };

  const register = async (name, email, password, photoUrl) => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photoUrl || undefined,
    });
    if (error) {
      throw new Error(error.message || "Failed to register");
    }
    return data;
  };

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Custom logout endpoint failed:", err);
    }

    await authClient.signOut();
    setUser(null);
  };

  const loginWithGoogle = async () => {
    // For social login, Better Auth redirects, then comes back to callbackURL
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin
    });
    if (error) {
      throw new Error(error.message || "Google login failed");
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
