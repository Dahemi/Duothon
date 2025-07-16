import React from "react";

interface AlgorithmicProblem {
  title: string;
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  language: string[];
}

interface ChallengeCardProps {
  algorithmicProblem: AlgorithmicProblem;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  algorithmicProblem: {
    title,
    description,
    constraints,
    inputFormat,
    outputFormat,
    sampleInput,
    sampleOutput
  }
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 hover:-translate-y-1 transition-transform duration-200">
      <div className="border-b-2 border-blue-500 mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <span className="text-xl mr-2">📝</span> Description
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <span className="text-xl mr-2">📌</span> Constraints
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm my-2">
          {constraints}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <span className="text-xl mr-2">📥</span> Input Format
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg text-sm my-2">
          {inputFormat}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <span className="text-xl mr-2">📤</span> Output Format
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg text-sm my-2">
          {outputFormat}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <span className="text-xl mr-2">📥</span> Sample Input
          </h3>
          <pre className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
            {sampleInput}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <span className="text-xl mr-2">📤</span> Sample Output
          </h3>
          <pre className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
            {sampleOutput}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;