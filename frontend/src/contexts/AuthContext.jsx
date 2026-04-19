import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simple session validation (not cryptographically secure, but better than nothing)
  const generateSessionId = () => {
    return btoa(Math.random().toString()).substring(0, 12);
  };

  const validateSession = (storedSessionId) => {
    // In production, this should validate against server
    const currentTime = Date.now();
    const sessionTime = parseInt(localStorage.getItem("sessionTime") || "0");
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    return (currentTime - sessionTime) < sessionDuration;
  };

  // Check auth status on mount with validation
  useEffect(() => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      const sessionId = localStorage.getItem("sessionId");

      // Validate data structure, format, and session
      if (userEmail && userName && sessionId &&
          typeof userEmail === 'string' &&
          typeof userName === 'string' &&
          userEmail.includes('@') &&
          userEmail.length > 5 &&
          userName.length > 0 &&
          validateSession(sessionId)) {
        setUser({ email: userEmail, name: userName });
      } else {
        // Clear invalid/expired session data
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("sessionTime");
      }
    } catch (error) {
      // Clear corrupted data on error
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionTime");
      console.warn("Auth initialization error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    // Validate userData before storing
    if (!userData?.email || !userData?.name ||
        typeof userData.email !== 'string' ||
        typeof userData.name !== 'string' ||
        !userData.email.includes('@')) {
      console.error("Invalid user data provided to login:", userData);
      return false;
    }

    try {
      const sessionId = generateSessionId();
      const sessionTime = Date.now().toString();

      setUser(userData);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("sessionTime", sessionTime);
      return true;
    } catch (error) {
      console.error("Login storage error:", error);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionTime");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}