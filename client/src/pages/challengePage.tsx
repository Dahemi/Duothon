import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeCard from "../components/challengeCard";
import CodeEditor from "../components/codeEditor";
import OutputBox from "../components/outputBox";
import { executeCode, statusMap } from "../services/judge0";
import API from "../services/api";

interface Challenge {
  _id: string;
  title: string;
  isActive: boolean;
  algorithmicProblem: {
    title: string;
    description: string;
    constraints: string;
    inputFormat: string;
    outputFormat: string;
    sampleInput: string;
    sampleOutput: string;
    language: string[];
  };
  correctFlag: string;
  buildathonProblem: {
    title: string;
    description: string;
    hints: string;
  };
}

const ChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>("");
  const [languageId, setLanguageId] = useState<number>(71);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flagError, setFlagError] = useState<string>("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await API.get('/challenges/active');
        setChallenge(response.data);
      } catch (err) {
        console.error('Failed to fetch challenge:', err);
      }
    };
    fetchChallenge();
  }, []);

  const handleRunCode = async () => {
    try {
      setIsLoading(true);
      setOutput(null);
      setError(null);
      setStatus("Running...");

      const result = await executeCode(code, languageId);
      
      setOutput(result.stdout);
      setError(result.stderr || result.compile_output);
      setStatus(statusMap[result.status.id]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlagSubmit = () => {
    setFlagError("");
    if (challenge && flag.trim() === challenge.correctFlag) {
      navigate("/buildathon");
    } else {
      setFlagError("Incorrect flag! Try again.");
    }
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <ChallengeCard
          algorithmicProblem={challenge.algorithmicProblem}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <CodeEditor
            code={code}
            setCode={setCode}
            languageId={languageId}
            setLanguageId={setLanguageId}
            allowedLanguages={challenge.algorithmicProblem.language}
          />
          <button
            onClick={handleRunCode}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white
              ${isLoading 
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
          >
            {isLoading ? "Running..." : "Run Code"}
          </button>
        </div>

        <div className="space-y-4">
          <OutputBox
            output={output}
            error={error}
            status={status}
          />

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Submit Flag
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => {
                    setFlag(e.target.value);
                    setFlagError("");
                  }}
                  placeholder="Enter flag (e.g., duothon{flag})"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleFlagSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Flag
                </button>
              </div>
              {flagError && (
                <p className="text-red-500 text-sm">{flagError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;