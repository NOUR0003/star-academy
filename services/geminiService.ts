
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
// Always use the named parameter `apiKey`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonSummary = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise educational summary and 3 study tips for a lesson titled "${title}" with the following description: "${description}". Format the output in Markdown.`,
    });
    // Directly access the .text property of GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Could not generate summary at this time.";
  }
};

export const generateQuickQuiz = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 3 multiple-choice questions based on the lesson "${title}": ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              answerIndex: { type: Type.INTEGER }
            },
            required: ["question", "options", "answerIndex"]
          }
        }
      }
    });
    // Ensure response.text is treated correctly as a string and handled if empty.
    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini quiz error:", error);
    return [];
  }
};
