import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { executeCode, statusMap } from "../services/judge0";
import {
  Code,
  Play,
  Flag,
  Github,
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  Zap,
} from "lucide-react";

interface Challenge {
  _id: string;
  title: string;
  algorithmicProblem: {
    description: string;
    constraints: string;
    inputFormat: string;
    outputFormat: string;
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

interface Submission {
  _id: string;
  type: "algorithmic" | "buildathon";
  isCorrect: boolean | null;
  submittedAt: string;
}

const ChallengePortal: React.FC = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Algorithmic Problem State
  const [code, setCode] = useState<string>("");
  const [languageId, setLanguageId] = useState<number>(71); // Python
  const [output, setOutput] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<string>("");

  // Flag Submission State
  const [flag, setFlag] = useState<string>("");
  const [flagError, setFlagError] = useState<string>("");
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flagSubmitted, setFlagSubmitted] = useState(false);

  // Buildathon State
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [buildathonError, setBuildathonError] = useState<string>("");
  const [isSubmittingBuildathon, setIsSubmittingBuildathon] = useState(false);
  const [buildathonSubmitted, setBuildathonSubmitted] = useState(false);

  const languageOptions = [
    { id: 63, name: "JavaScript", extension: "js" },
    { id: 71, name: "Python", extension: "py" },
    { id: 62, name: "Java", extension: "java" },
    { id: 54, name: "C++", extension: "cpp" },
    { id: 50, name: "C", extension: "c" },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchChallengeData();
  }, [user, navigate]);

  const fetchChallengeData = async () => {
    try {
      setIsLoading(true);
      const [challengeRes, submissionsRes] = await Promise.all([
        API.get("/challenges/active"),
        API.get("/submissions"),
      ]);

      setChallenge(challengeRes.data);
      setSubmissions(submissionsRes.data);

      // Check if flag was already submitted correctly
      const flagSubmission = submissionsRes.data.find(
        (sub: Submission) =>
          sub.type === "algorithmic" && sub.isCorrect === true
      );
      if (flagSubmission) {
        setFlagSubmitted(true);
      }

      // Check if buildathon was already submitted
      const buildathonSubmission = submissionsRes.data.find(
        (sub: Submission) => sub.type === "buildathon"
      );
      if (buildathonSubmission) {
        setBuildathonSubmitted(true);
      }
    } catch (err) {
      setError("Failed to load challenge data");
      console.error("Error fetching challenge data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setCodeError("Please enter some code to run");
      return;
    }

    try {
      setIsRunning(true);
      setOutput(null);
      setCodeError(null);
      setExecutionStatus("Running...");

      const result = await executeCode(code, languageId);

      setOutput(result.stdout || "No output");
      setCodeError(result.stderr || result.compile_output || null);
      setExecutionStatus(statusMap[result.status.id] || "Unknown");
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : "An error occurred");
      setExecutionStatus("Error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleFlagSubmit = async () => {
    if (!flag.trim()) {
      setFlagError("Please enter a flag");
      return;
    }

    if (!challenge) {
      setFlagError("Challenge not loaded");
      return;
    }

    try {
      setIsSubmittingFlag(true);
      setFlagError("");

      const isCorrect = flag.trim() === challenge.correctFlag;

      await API.post("/submissions", {
        challenge: challenge._id,
        type: "algorithmic",
        code: code,
        language:
          languageOptions.find((lang) => lang.id === languageId)?.name ||
          "Unknown",
        output: output || "",
        isCorrect: isCorrect,
      });

      if (isCorrect) {
        setFlagSubmitted(true);
        setFlagError("");
      } else {
        setFlagError("Incorrect flag! Try again.");
      }
    } catch (err) {
      setFlagError("Failed to submit flag. Please try again.");
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const handleBuildathonSubmit = async () => {
    if (!githubUrl.trim()) {
      setBuildathonError("Please enter a GitHub repository URL");
      return;
    }

    if (!githubUrl.startsWith("https://github.com/")) {
      setBuildathonError("Please enter a valid GitHub repository URL");
      return;
    }

    try {
      setIsSubmittingBuildathon(true);
      setBuildathonError("");

      await API.post("/submissions", {
        challenge: challenge?._id,
        type: "buildathon",
        githubLink: githubUrl.trim(),
        isCorrect: null, // Will be reviewed by admins
      });

      setBuildathonSubmitted(true);
      setBuildathonError("");
    } catch (err) {
      setBuildathonError(
        "Failed to submit buildathon solution. Please try again."
      );
    } finally {
      setIsSubmittingBuildathon(false);
    }
  };

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge portal...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error || "Challenge not found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Challenge Portal
                </h1>
                {/* <p className="text-sm text-gray-600">Team: {user?.teamName}</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Challenge Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {challenge.title}
          </h2>
          <p className="text-gray-600">
            Complete the algorithmic challenge to unlock the buildathon task
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Algorithm
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div className="w-full h-full bg-blue-500 rounded"></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  flagSubmitted ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Flag
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div
                className={`h-full rounded transition-all duration-300 ${
                  flagSubmitted ? "w-full bg-green-500" : "w-0"
                }`}
              ></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  buildathonSubmitted
                    ? "bg-green-500"
                    : flagSubmitted
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              >
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Buildathon
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Algorithmic Problem */}
          <div className="space-y-6">
            {/* Problem Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Algorithmic Problem
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {challenge.algorithmicProblem.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Input Format
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                      {challenge.algorithmicProblem.inputFormat}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Output Format
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                      {challenge.algorithmicProblem.outputFormat}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Constraints
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                    {challenge.algorithmicProblem.constraints}
                  </div>
                </div>

                {challenge.algorithmicProblem.examples.map((example, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Example {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Input:
                        </p>
                        <pre className="bg-gray-50 p-2 rounded text-sm font-mono">
                          {example.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Output:
                        </p>
                        <pre className="bg-gray-50 p-2 rounded text-sm font-mono">
                          {example.output}
                        </pre>
                      </div>
                    </div>
                    {example.explanation && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-gray-700">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Code Editor
                </h3>
                <select
                  value={languageId}
                  onChange={(e) => setLanguageId(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
              />

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  {executionStatus && (
                    <span className="text-sm text-gray-600">
                      Status: {executionStatus}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    isRunning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </button>
              </div>
            </div>

            {/* Output */}
            {(output || codeError) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Output
                </h3>
                {codeError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-mono text-sm whitespace-pre-wrap">
                      {codeError}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Flag Submission & Buildathon */}
          <div className="space-y-6">
            {/* Flag Submission */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Flag className="w-5 h-5 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Flag Submission
                </h3>
                {flagSubmitted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              {flagSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-800 font-medium">
                      Flag submitted successfully!
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You can now access the buildathon challenge below.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Run your code and submit the output as a flag to unlock the
                    buildathon challenge.
                  </p>

                  <div>
                    <input
                      type="text"
                      value={flag}
                      onChange={(e) => {
                        setFlag(e.target.value);
                        setFlagError("");
                      }}
                      placeholder="Enter your flag here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    {flagError && (
                      <p className="text-red-600 text-sm mt-1">{flagError}</p>
                    )}
                  </div>

                  <button
                    onClick={handleFlagSubmit}
                    disabled={isSubmittingFlag}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
                      isSubmittingFlag
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isSubmittingFlag ? "Submitting..." : "Submit Flag"}
                  </button>
                </div>
              )}
            </div>

            {/* Buildathon Challenge */}
            <div
              className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
                !flagSubmitted ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Buildathon Challenge
                </h3>
                {buildathonSubmitted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              {!flagSubmitted && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-700 font-medium">Locked</p>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete the flag submission to unlock this challenge.
                  </p>
                </div>
              )}

              {flagSubmitted && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Project Description
                    </h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {challenge.buildathonProblem.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Requirements
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {challenge.buildathonProblem.requirements.map(
                        (req, index) => (
                          <li key={index}>{req}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {challenge.buildathonProblem.techStack &&
                    challenge.buildathonProblem.techStack.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Suggested Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {challenge.buildathonProblem.techStack.map(
                            (tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Deliverables
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {challenge.buildathonProblem.deliverables.map(
                        (deliverable, index) => (
                          <li key={index}>{deliverable}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {buildathonSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-green-800 font-medium">
                          Buildathon solution submitted!
                        </p>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Your submission is under review by the admin team.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={githubUrl}
                          onChange={(e) => {
                            setGithubUrl(e.target.value);
                            setBuildathonError("");
                          }}
                          placeholder="https://github.com/username/repository"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        {buildathonError && (
                          <p className="text-red-600 text-sm mt-1">
                            {buildathonError}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleBuildathonSubmit}
                        disabled={isSubmittingBuildathon}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center space-x-2 ${
                          isSubmittingBuildathon
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>
                          {isSubmittingBuildathon
                            ? "Submitting..."
                            : "Submit Buildathon Solution"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePortal;
