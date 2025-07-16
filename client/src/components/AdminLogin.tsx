import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username: credentials.username,
          password: credentials.password,
        }
      );

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));

        // Navigate to admin dashboard
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl">
        <div>
          <button
            onClick={() => navigate("/")}
            className="text-blue-400 hover:text-white mb-4 flex items-center"
          >
            ← Back to Home
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900 bg-opacity-50 p-3 rounded-md border border-red-500">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
