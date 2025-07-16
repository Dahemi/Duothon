import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Flag } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import challengeApi from '../../services/challengeApi';
import type { Challenge } from '../../services/challengeApi';

interface ChallengeListProps {
  onEditChallenge: (challenge: Challenge) => void;
  onCreateNew: () => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ onEditChallenge, onCreateNew }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; challenge: Challenge | null }>({
    isOpen: false,
    challenge: null
  });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; challenge: Challenge | null }>({
    isOpen: false,
    challenge: null
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    const filtered = challenges.filter(challenge =>
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.algorithmicProblem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.buildathonProblem.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChallenges(filtered);
  }, [challenges, searchTerm]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await challengeApi.getAllChallenges();
      setChallenges(data);
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
      // Mock data for development/fallback
      setChallenges([
        {
          _id: '1',
          title: 'Array Manipulation & Web Dashboard',
          algorithmicProblem: {
            description: 'Given an array of integers, find the maximum sum of a contiguous subarray.',
            inputFormat: 'First line contains n, second line contains n integers',
            outputFormat: 'Single integer representing the maximum sum',
            constraints: '1 ≤ n ≤ 10^5, -10^6 ≤ arr[i] ≤ 10^6',
            examples: [
              {
                input: '5\\n-2 1 -3 4 1',
                output: '5',
                explanation: 'The subarray [4, 1] has the maximum sum of 5'
              }
            ]
          },
          buildathonProblem: {
            description: 'Create a web dashboard that visualizes array operations and displays the algorithm solution.',
            requirements: [
              'Interactive array input interface',
              'Real-time visualization of algorithm steps',
              'Display of optimal subarray',
              'Performance metrics display'
            ],
            techStack: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS'],
            deliverables: [
              'Working web application',
              'Source code repository',
              'Documentation'
            ]
          },
          correctFlag: 'DUOTHON{max_subarray_5_web_dash}',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    try {
      await challengeApi.deleteChallenge(id);
      setChallenges(challenges.filter(c => c._id !== id));
      setDeleteModal({ isOpen: false, challenge: null });
    } catch (error: any) {
      console.error('Error deleting challenge:', error);
      // You might want to show a toast notification here
      alert(error.message || 'Failed to delete challenge');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Challenge Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage algorithmic and buildathon challenges</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="w-full sm:w-64 lg:w-80">
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>
          <Button onClick={onCreateNew} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create Challenge</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge._id} className="hover:shadow-medium transition-all duration-200 group">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 flex-1 leading-tight">
                  {challenge.title}
                </h3>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                  <button
                    onClick={() => setViewModal({ isOpen: true, challenge })}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditChallenge(challenge)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Challenge"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, challenge })}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Challenge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {challenge.algorithmicProblem.description}
                </p>
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <Flag className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="font-mono text-xs truncate">
                    {challenge.correctFlag.substring(0, 25)}...
                  </span>
                </div>
              </div>

              {/* Tech Stack */}
              {challenge.buildathonProblem.techStack && challenge.buildathonProblem.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {challenge.buildathonProblem.techStack.slice(0, 2).map((tech, index) => (
                    <Badge key={index} variant="info" size="sm" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {challenge.buildathonProblem.techStack.length > 2 && (
                    <Badge variant="gray" size="sm" className="text-xs">
                      +{challenge.buildathonProblem.techStack.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{challenge.createdAt ? formatDate(challenge.createdAt) : 'N/A'}</span>
                  <span className="sm:hidden">{challenge.createdAt ? new Date(challenge.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</span>
                </div>
                <Badge variant="success" size="sm" className="text-xs">
                  Active
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first challenge'}
          </p>
          {!searchTerm && (
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, challenge: null })}
        title="Delete Challenge"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteModal.challenge?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, challenge: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteModal.challenge?._id && handleDeleteChallenge(deleteModal.challenge._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, challenge: null })}
        title={viewModal.challenge?.title || ''}
        size="xl"
      >
        {viewModal.challenge && (
          <div className="space-y-6">
            {/* Algorithmic Problem */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Algorithmic Problem</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-600">{viewModal.challenge.algorithmicProblem.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Input Format</label>
                    <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                      {viewModal.challenge.algorithmicProblem.inputFormat}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                    <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                      {viewModal.challenge.algorithmicProblem.outputFormat}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Constraints</label>
                  <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                    {viewModal.challenge.algorithmicProblem.constraints}
                  </p>
                </div>
              </div>
            </div>

            {/* Buildathon Problem */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Buildathon Problem</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-600">{viewModal.challenge.buildathonProblem.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {viewModal.challenge.buildathonProblem.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                {viewModal.challenge.buildathonProblem.techStack && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                    <div className="flex flex-wrap gap-2">
                      {viewModal.challenge.buildathonProblem.techStack.map((tech, index) => (
                        <Badge key={index} variant="info">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Correct Flag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Flag</label>
              <p className="font-mono text-sm bg-green-50 text-green-800 p-3 rounded border border-green-200">
                {viewModal.challenge.correctFlag}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChallengeList;
