// client/src/component/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

interface Team {
  _id: string;
  teamName: string;
  email: string;
  authProvider: string;
  createdAt: string;
  challengesSolved: string[];
  buildathonSubmissions: any[];
}

export const Dashboard: React.FC = () => {
  const { user, logOut } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await API.get("/teams/current");
        setTeam(response.data.team);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTeamData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Team Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Team Information
              </h3>
              {team && (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Team Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {team.teamName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{team.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Challenges Solved
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {team.challengesSolved.length}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Joined
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
