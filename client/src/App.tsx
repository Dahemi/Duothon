import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Homepage from "./components/Homepage";
import { LoginPage } from "./components/LoginPage";
import { SignUp } from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import ChallengePortal from "./components/ChallengePortal";
import { AdminLogin } from "./components/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import SubmissionsPage from "./pages/admin/submissions";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenge"
            element={
              <ProtectedRoute>
                <ChallengePortal />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <AdminProtectedRoute>
                <SubmissionsPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
