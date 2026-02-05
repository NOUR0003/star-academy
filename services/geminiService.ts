// services/geminiService.ts

// 1. Export the exact function name LessonView is looking for
export const generateLessonSummary = async (title: string, description: string) => {
  console.log("AI Summary skipped (Safe Mode)");
  // Return a placeholder string so the UI has something to show
  return "AI summary is currently disabled. Please contact the administrator.";
};

// 2. Export the exact quiz function name
export const generateQuickQuiz = async (title: string, description: string) => {
  console.log("AI Quiz skipped (Safe Mode)");
  // Return an empty array so the map() function doesn't crash
  return [];
};
