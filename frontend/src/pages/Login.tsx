import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      await login(data.access_token);
      navigate("/dashboard");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-extrabold text-white"
          >
            NextOffer AI
          </Link>

          <p className="text-gray-400 mt-3">
            Continue your career journey
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#172554] border border-blue-900/60
          rounded-2xl p-8 shadow-2xl"
        >

          <h1 className="text-2xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2 mb-7">
            Login to your NextOffer AI account
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10
              border border-red-500/30 px-4 py-3
              text-sm text-red-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium
                text-gray-300 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg
                bg-[#0B1220] border border-blue-900
                text-white placeholder-gray-500
                focus:outline-none focus:border-[#06B6D4]
                focus:ring-1 focus:ring-[#06B6D4]"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-[#06B6D4]
                  hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg
                  bg-[#0B1220] border border-blue-900
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#06B6D4]
                  focus:ring-1 focus:ring-[#06B6D4]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg
              bg-[#FF7A00] hover:bg-[#e66d00]
              text-white font-bold transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <div className="mt-7 pt-6 border-t border-white/10 text-center">

            <p className="text-gray-400 text-sm">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="inline-block mt-2 text-[#06B6D4]
              font-semibold hover:underline"
            >
              Create an account
            </Link>

          </div>

        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;