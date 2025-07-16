import React, { useState, useEffect } from "react";
import API from "../../services/api";

interface Submission {
  _id: string;
  team: {
    name: string;
  };
  challenge: {
    title: string;
  };
  type: 'algorithmic' | 'buildathon';
  code?: string;
  language?: string;
  output?: string;
  isCorrect: boolean | null;
  githubLink?: string;
  submittedAt: string;
}

const SubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await API.get('/submissions');
        setSubmissions(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load submissions');
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Submissions</h1>
      
      <div className="grid gap-6">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {submission.challenge.title}
                </h2>
                <p className="text-gray-600">
                  Team: {submission.team?.name || "Anonymous"}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    submission.type === 'algorithmic' 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {submission.type}
                </span>
                {submission.isCorrect !== null && (
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                      submission.isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {submission.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>
            </div>

            {submission.type === 'algorithmic' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Language
                  </h3>
                  <p className="text-gray-600">{submission.language}</p>
                </div>
                {submission.code && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Code
                    </h3>
                    <pre className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {submission.code}
                    </pre>
                  </div>
                )}
                {submission.output && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Output
                    </h3>
                    <pre className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      {submission.output}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  GitHub Repository
                </h3>
                <a
                  href={submission.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {submission.githubLink}
                </a>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsPage;