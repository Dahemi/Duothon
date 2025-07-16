import React from "react";

interface OutputBoxProps {
  output: string | null;
  error: string | null;
  status: string;
}

const OutputBox: React.FC<OutputBoxProps> = ({ output, error, status }) => {
  if (!output && !error && !status) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-center">
          Run your code to see the result.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 bg-gray-50 rounded-lg border border-gray-200 p-6 shadow-lg">
      <div className="flex items-center gap-2 border-b pb-3">
        <span className="text-sm font-semibold text-gray-700">Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            error
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status}
        </span>
      </div>

      {output && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Output:</h3>
          <pre className="w-full bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto font-mono text-sm">
            {output}
          </pre>
        </div>
      )}

      {error && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Error:</h3>
          <pre className="w-full bg-red-600 text-white rounded-lg p-4 overflow-x-auto font-mono text-sm">
            {error}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OutputBox;