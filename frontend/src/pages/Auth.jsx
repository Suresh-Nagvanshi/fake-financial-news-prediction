import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { buildUrl, apiRequest } from "../config/api";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rate limiting: prevent spam attempts (5 second cooldown)
    const now = Date.now();
    if (now - lastAttempt < 5000) {
      alert("Please wait 5 seconds before trying again");
      return;
    }
    setLastAttempt(now);

    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const name = isLogin ? null : e.target.name?.value.trim();

    // Client-side validation
    if (!email || !password) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!email.includes('@') || email.length < 5) {
      alert("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!isLogin && (!name || name.length < 2)) {
      alert("Please enter a valid name (at least 2 characters)");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const formData = {
      email,
      password,
      ...(isLogin ? {} : { name }),
    };

    try {
      const response = await apiRequest(
        buildUrl(isLogin ? '/login' : '/register'),
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        if (isLogin) {
          // Validate user data before login
          if (data.user?.email && data.user?.name) {
            const loginSuccess = login(data.user);
            if (loginSuccess) {
              navigate("/dashboard");
            } else {
              alert("Login failed: Invalid user data received");
            }
          } else {
            alert("Login failed: Invalid user data received from server");
          }
        } else {
          // Registration success
          setIsLogin(true);
          alert("Registration successful! Please login with your credentials.");
        }

        e.target.reset();
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("Network error: Please check your internet connection");
      } else {
        alert("Authentication failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="relative z-10 w-full max-w-md bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-center text-gray-400 mb-6">
          {isLogin ? "Login to continue" : "Register to get started"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="p-4 rounded-xl bg-background border border-white/10 text-white focus:outline-none focus:border-cyan-500"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="p-4 rounded-xl bg-background border border-white/10 text-white focus:outline-none focus:border-cyan-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="p-4 rounded-xl bg-background border border-white/10 text-white focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          className="w-full border border-white/10 py-3 rounded-xl text-white hover:bg-white/5 transition-all"
        >
          Continue with Google
        </button>

      </div>
    </main>
  );
}

export default Auth;