// client/src/component/SignUp.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface SignUpProps {}

export const SignUp: React.FC<SignUpProps> = () => {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { googleSignIn, user } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await googleSignIn(teamName);
      navigate("/challenge");
    } catch (error: any) {
      setError(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 bg-opacity-80 rounded-xl border border-cyan-400 shadow-neon">
        <div>
          <button
            onClick={() => navigate("/")}
            className="text-cyan-400 hover:text-white mb-4 flex items-center"
          >
            ← Back to Home
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create Your Team
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Join the challenge with your team
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="teamName" className="sr-only">
              Team Name
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              required
              className="relative block w-full px-3 py-2 border border-gray-600 rounded-md placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Enter your team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900 bg-opacity-50 p-3 rounded-md border border-red-500">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Creating Team..." : "Sign Up with Google"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-300">
              Already have a team?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Login here
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
