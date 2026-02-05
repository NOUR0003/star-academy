// services/geminiService.ts

// We replaced the real AI with this empty shell to fix the crash.
export const getGeminiResponse = async (message: string) => {
  console.log("AI is disabled");
  return "AI features are currently disabled.";
};

export const initializeAI = () => {
  console.log("AI Init skipped");
};
