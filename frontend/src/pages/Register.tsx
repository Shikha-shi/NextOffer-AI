import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Registration failed."
        );
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

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
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-6 py-10">

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
            Start your career journey today
          </p>

        </div>

        {/* Registration Card */}
        <div className="bg-[#172554] border border-blue-900/60
          rounded-2xl p-8 shadow-2xl"
        >

          <h1 className="text-2xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-gray-400 mt-2 mb-7">
            Create your NextOffer AI account
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

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg bg-green-500/10
              border border-green-500/30 px-4 py-3
              text-sm text-green-400"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium
                text-gray-300 mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 rounded-lg
                bg-[#0B1220] border border-blue-900
                text-white placeholder-gray-500
                focus:outline-none focus:border-[#06B6D4]
                focus:ring-1 focus:ring-[#06B6D4]"
              />
            </div>

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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
              <label
                htmlFor="password"
                className="block text-sm font-medium
                text-gray-300 mb-2"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-3 pr-16 rounded-lg
                  bg-[#0B1220] border border-blue-900
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#06B6D4]
                  focus:ring-1 focus:ring-[#06B6D4]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2
                  -translate-y-1/2 text-sm text-gray-400
                  hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              <p className="text-xs text-gray-500 mt-2">
                Minimum 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium
                text-gray-300 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3 pr-16 rounded-lg
                  bg-[#0B1220] border border-blue-900
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-[#06B6D4]
                  focus:ring-1 focus:ring-[#06B6D4]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2
                  -translate-y-1/2 text-sm text-gray-400
                  hover:text-white"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                required
                className="mt-1 accent-[#FF7A00]"
              />

              <p className="text-sm text-gray-400">
                I agree to the{" "}
                <span className="text-[#06B6D4]">
                  Terms & Conditions
                </span>{" "}
                and Privacy Policy.
              </p>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg
              bg-[#FF7A00] hover:bg-[#e66d00]
              text-white font-bold transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-7 pt-6 border-t border-white/10 text-center">

            <p className="text-gray-400 text-sm">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-block mt-2 text-[#06B6D4]
              font-semibold hover:underline"
            >
              Login to your account
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

export default Register;