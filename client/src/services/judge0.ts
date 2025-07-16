const JUDGE0_API = "http://10.3.5.139:2358";
const API_KEY = "ZHVvdGhhbjUuMA=="; 
interface JudgeResult {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
  compile_output: string | null;
  time: string;
  memory: number;
}

export const statusMap: { [key: number]: string } = {
  1: "In Queue",
  2: "Processing",
  3: "Accepted",
  4: "Wrong Answer",
  5: "Time Limit Exceeded",
  6: "Compilation Error",
  7: "Runtime Error (SIGSEGV)",
  8: "Runtime Error (SIGXFSZ)",
  9: "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error"
};

export const executeCode = async (
  sourceCode: string,
  languageId: number,
  stdin: string = ""
): Promise<JudgeResult> => {
  try {
    // Submit code
    const submitRes = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": API_KEY,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin,
      }),
    });

    if (!submitRes.ok) {
      throw new Error("Failed to submit code");
    }

    const { token } = await submitRes.json();

    // Poll for results
    let retries = 10;
    const pollingInterval = 1000; // 1 second

    while (retries > 0) {
      const resultRes = await fetch(`${JUDGE0_API}/submissions/${token}`, {
        headers: { "X-Auth-Token": API_KEY },
      });

      if (!resultRes.ok) {
        throw new Error("Failed to fetch submission status");
      }

      const result: JudgeResult = await resultRes.json();

      // Check if processing is complete
      if (result.status.id >= 3) {
        return {
          ...result,
          stdout: result.stdout || null,
          stderr: result.stderr || null,
          compile_output: result.compile_output || null
        };
      }

      // Wait before next polling attempt
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
      retries--;
    }

    throw new Error("Polling timeout - compilation taking too long");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Code execution failed: ${error.message}`);
    }
    throw new Error("Code execution failed");
  }
};

export const getLanguageName = (languageId: number): string => {
  const languages: { [key: number]: string } = {
    71: "Python",
    54: "C++",
    62: "Java",
    63: "JavaScript"
  };
  return languages[languageId] || "Unknown Language";
};