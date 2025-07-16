import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { googleSignIn, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await googleSignIn();
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 bg-[url('https://source.unsplash.com/random/1920x1080?cyberpunk')] bg-cover bg-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 bg-opacity-80 rounded-xl border border-neon-blue shadow-neon">
        <div>
          <button
            onClick={() => navigate("/")}
            className="text-cyan-400 hover:text-white mb-4 flex items-center"
          >
            ← Back to Home
          </button>
          <h2 className="mt-6 text-center text-4xl font-bold text-neon-blue tracking-wider">
            OASIS REBOOT
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Unlock the Master Key to Restore the OASIS
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-900 bg-opacity-50 p-3 rounded-md border border-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-neon-blue text-sm font-medium rounded-md text-neon-blue bg-gray-800 hover:bg-neon-blue hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue disabled:opacity-50 transition-all duration-300"
          >
            {isLoading ? "Decrypting..." : "Access OASIS with Google"}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-400">
              New to the OASIS?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-medium text-neon-blue hover:text-neon-blue-light transition-colors"
              >
                Join the Builder Challenge
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
