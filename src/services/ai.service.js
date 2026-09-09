import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateAISubtasks = async (title, description) => {

  const prompt = `
Generate 4 to 6 subtasks for this task.

Title: ${title}
Description: ${description}

Return only JSON like this:
{
  "subtasks": [
    { "title": "subtask 1" },
    { "title": "subtask 2" }
  ]
}
`;

  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt
  });

  return JSON.parse(response.text);
};