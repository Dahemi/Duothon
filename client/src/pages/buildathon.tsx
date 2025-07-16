import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

interface BuildathonProblem {
  title: string;
  description: string;
  hints: string;
}

interface Challenge {
  _id: string;
  buildathonProblem: BuildathonProblem;
}

const BuildathonPage: React.FC = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBuildathonChallenge = async () => {
      try {
        const response = await API.get('/challenges/active');
        setChallenge(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load buildathon challenge');
        setIsLoading(false);
      }
    };

    fetchBuildathonChallenge();
  }, []);

  const handleSubmit = async () => {
  if (!githubUrl.trim()) {
    setSubmitError("Please enter a GitHub repository URL");
    return;
  }

  if (!githubUrl.startsWith("https://github.com/")) {
    setSubmitError("Please enter a valid GitHub repository URL");
    return;
  }

  try {
    setIsSubmitting(true);
    setSubmitError("");
    
    await API.post('/submissions', {
      challenge: challenge?._id,
      type: 'buildathon',
      githubLink: githubUrl.trim(),
      isCorrect: null // Will be updated after review
    });

    // Show success message and redirect
    navigate("/success");
  } catch (err) {
    setSubmitError("Failed to submit. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          {error || "Challenge not found"}
        </div>
      </div>
    );
  }

  const { buildathonProblem } = challenge;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        {/* Header */}
        <div className="border-b-2 border-blue-500 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            {buildathonProblem.title}
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">🎯</span> Challenge Description
          </h2>
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {buildathonProblem.description}
            </div>
          </div>
        </div>

        {/* Hints Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span> Hints
          </h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line">
            {buildathonProblem.hints}
          </div>
        </div>

        {/* Submission Section */}
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">🚀</span> Submit Your Solution
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository URL
              </label>
              <input
                id="github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  setSubmitError("");
                }}
                placeholder="https://github.com/username/repository"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={isSubmitting}
              />
              {submitError && (
                <p className="mt-2 text-sm text-red-600">{submitError}</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-white
                ${isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
            >
              {isSubmitting ? "Submitting..." : "Submit Solution"}
            </button>
          </div>
        </div>

        {/* Resources Section */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-2xl mr-2">📚</span> Additional Resources
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Check the official documentation</li>
            <li>Join our Discord community for help</li>
            <li>Review related tutorials and examples</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuildathonPage;