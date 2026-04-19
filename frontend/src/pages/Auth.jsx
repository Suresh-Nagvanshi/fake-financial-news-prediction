import React, { useState } from "react";


function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      ...(isLogin ? {} : { name: e.target.name.value })
    };

    try {
      const response = await fetch(
        `http://localhost:8000/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // 🔥 STORE USER EMAIL
        localStorage.setItem("userEmail", formData.email);

        // 🔥 REDIRECT AFTER LOGIN
        if (isLogin) {
          window.location.href = "/dashboard";
        }

        e.target.reset();

      } else {
        alert(data.detail || "An error occurred");
      }

    } catch (error) {
      alert("Network error: " + error.message);
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
            className="mt-2 bg-primary hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition-all"
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