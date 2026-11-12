
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Step 1: Prepare login credentials
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      // Step 2: Send login request
      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Step 3: Store JWT token
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // Step 4: Fetch logged-in user details
      const userResponse = await api.get("/users/me");

      const user = userResponse.data;

      // Step 5: Update AuthContext
      login(user);

      // Step 6: Navigate based on role
      if (user.role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else if (user.role === "USER") {
        navigate("/student-dashboard", { replace: true });
      } else {
        localStorage.removeItem("access_token");
        setError("Invalid user role");
      }

    } catch (error) {
      localStorage.removeItem("access_token");

      setError(
        error.response?.data?.detail ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-purple-700">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Login to your college complaint portal
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
