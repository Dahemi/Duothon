import API from './api';

export interface Challenge {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChallengeRequest {
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

export interface UpdateChallengeRequest extends CreateChallengeRequest {
  _id: string;
}

export interface ApiResponse<T> {
  message: string;
  challenge?: T;
  challenges?: T[];
}

export const challengeApi = {
  // Get all challenges
  getAllChallenges: async (): Promise<Challenge[]> => {
    try {
      const response = await API.get<Challenge[]>('/admin/challenges');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch challenges');
    }
  },

  // Create a new challenge
  createChallenge: async (challengeData: CreateChallengeRequest): Promise<Challenge> => {
    try {
      const response = await API.post<ApiResponse<Challenge>>('/admin/challenges', challengeData);
      return response.data.challenge!;
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to create challenge');
    }
  },

  // Update an existing challenge
  updateChallenge: async (id: string, challengeData: CreateChallengeRequest): Promise<Challenge> => {
    try {
      const response = await API.put<ApiResponse<Challenge>>(`/admin/challenges/${id}`, challengeData);
      return response.data.challenge!;
    } catch (error: any) {
      console.error('Error updating challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to update challenge');
    }
  },

  // Delete a challenge
  deleteChallenge: async (id: string): Promise<void> => {
    try {
      await API.delete<ApiResponse<Challenge>>(`/admin/challenges/${id}`);
    } catch (error: any) {
      console.error('Error deleting challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete challenge');
    }
  }
};

export default challengeApi;
