// client/src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Homepage from "./components/Homepage";
import { SignUp } from "./components/SignUp";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
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
            {/* Add more protected routes here */}
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
