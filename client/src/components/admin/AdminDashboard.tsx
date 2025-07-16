import React, { useState } from 'react';
import ChallengeList from './ChallengeList';
import ChallengeForm from './ChallengeForm';

interface Challenge {
  _id?: string;
  title: string;
  algorithmicProblem: {
    description: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
  };
  buildathonProblem: {
    description: string;
    requirements: string[];
    techStack?: string[];
    deliverables: string[];
  };
  correctFlag: string;
}

type ViewMode = 'list' | 'create' | 'edit';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNew = () => {
    setSelectedChallenge(undefined);
    setCurrentView('create');
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentView('edit');
  };

  const handleSaveChallenge = async (challenge: Challenge) => {
    try {
      setIsLoading(true);
      
      const url = challenge._id 
        ? `/api/admin/challenges/${challenge._id}`
        : '/api/admin/challenges';
      
      const method = challenge._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(challenge)
      });

      if (response.ok) {
        setCurrentView('list');
        setSelectedChallenge(undefined);
        // You might want to show a success toast here
      } else {
        // Handle error
        console.error('Failed to save challenge');
      }
    } catch (error) {
      console.error('Error saving challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedChallenge(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Add a header with orange accent, admin avatar, and stats */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white p-2 rounded-full shadow-md">
              <span className="text-lg text-gray-700">👋</span>
              <span className="ml-2 text-lg font-semibold text-gray-900">Admin</span>
            </div>
            <div className="bg-white p-3 rounded-full shadow-md">
              <span className="text-2xl text-gray-700">👑</span>
            </div>
            <div className="bg-white p-3 rounded-full shadow-md">
              <span className="text-2xl text-gray-700">🏆</span>
            </div>
          </div>
        </div>

        {/* Add quick actions with orange accent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Challenges</p>
              <p className="text-2xl font-bold text-gray-900">120</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-orange-600 text-3xl">🎯</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">500</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-orange-600 text-3xl">👥</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">1500</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-orange-600 text-3xl">📝</span>
            </div>
          </div>
        </div>

        {currentView === 'list' && (
          <ChallengeList
            onEditChallenge={handleEditChallenge}
            onCreateNew={handleCreateNew}
          />
        )}
        
        {(currentView === 'create' || currentView === 'edit') && (
          <ChallengeForm
            challenge={selectedChallenge}
            onSave={handleSaveChallenge}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
