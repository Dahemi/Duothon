import React from "react";

interface Language {
  id: number;
  name: string;
}

// Map language names to Judge0 IDs
const languageIdMap: { [key: string]: number } = {
  'python': 71,
  'cpp': 54,
  'java': 62,
  'javascript': 63
};

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  languageId: number;
  setLanguageId: (id: number) => void;
  allowedLanguages: string[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  languageId,
  setLanguageId,
  allowedLanguages
}) => {
  const languageOptions = allowedLanguages
    .map(lang => ({
      id: languageIdMap[lang.toLowerCase()],
      name: lang.charAt(0).toUpperCase() + lang.slice(1)
    }))
    .filter(lang => lang.id !== undefined);

  return (
    <div className="w-full space-y-4">
      <div>
        <select
          value={languageId}
          onChange={(e) => setLanguageId(Number(e.target.value))}
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg 
                   text-gray-700 focus:outline-none focus:border-blue-500"
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
        className="w-full h-96 p-4 bg-gray-50 border border-gray-300 rounded-lg
                 font-mono text-sm text-gray-800 resize-none
                 focus:outline-none focus:border-blue-500"
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;