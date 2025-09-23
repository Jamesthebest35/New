
import { GoogleGenAI, Type } from "@google/genai";
import { ScheduleAnalysis, IssueAnalysis, AllocationPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(jsonString: string, context: string): T | null => {
    try {
        const cleanedString = jsonString.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedString) as T;
    } catch (error) {
        console.error(`Error parsing JSON for ${context}:`, error);
        console.error("Original string:", jsonString);
        return null;
    }
};

export const analyzeSchedule = async (projectData: string): Promise<ScheduleAnalysis | null> => {
    const prompt = `Analyze the following construction project data and generate an optimized schedule. Identify the top 3 critical path tasks that are most likely to cause delays.
    
    Project Data:
    ${projectData}
    
    Provide the output as a JSON object that strictly adheres to the provided schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        optimizedSchedule: {
                            type: Type.ARRAY,
                            description: "The optimized project schedule.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    taskName: { type: Type.STRING },
                                    startDate: { type: Type.STRING, description: "Format: YYYY-MM-DD" },
                                    endDate: { type: Type.STRING, description: "Format: YYYY-MM-DD" },
                                    durationDays: { type: Type.INTEGER },
                                    dependencies: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["id", "taskName", "startDate", "endDate", "durationDays"]
                            }
                        },
                        riskAnalysis: {
                            type: Type.ARRAY,
                            description: "Analysis of tasks with the highest risk of causing delays.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    taskName: { type: Type.STRING },
                                    riskLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                                    reason: { type: Type.STRING }
                                },
                                required: ["taskName", "riskLevel", "reason"]
                            }
                        }
                    },
                    required: ["optimizedSchedule", "riskAnalysis"]
                }
            }
        });
        return parseJsonResponse<ScheduleAnalysis>(response.text, "Schedule Analysis");
    } catch (error) {
        console.error("Error analyzing schedule:", error);
        return null;
    }
};

export const analyzeIssue = async (description: string, imageBase64: string | null): Promise<IssueAnalysis | null> => {
    const prompt = `Analyze the following construction site issue. Categorize it, assess its priority, and suggest three clear, actionable steps for resolution.
    
    Issue Description: "${description}"
    
    Provide the output as a JSON object that strictly adheres to the provided schema.`;
    
    const contents = imageBase64 ? {
        parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]
    } : prompt;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING, enum: ['Safety', 'Material', 'Quality', 'Equipment', 'Documentation', 'Other'] },
                        priority: { type: Type.STRING, enum: ['Critical', 'High', 'Medium', 'Low'] },
                        suggestedSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["category", "priority", "suggestedSteps"]
                }
            }
        });
        return parseJsonResponse<IssueAnalysis>(response.text, "Issue Analysis");
    } catch (error) {
        console.error("Error analyzing issue:", error);
        return null;
    }
};

export const generateResourceAllocation = async (tasks: string, resources: string): Promise<AllocationPlan | null> => {
    const prompt = `Based on the current project tasks and available resources, create an optimal resource allocation plan for the next work day.
    
    Current Tasks:
    ${tasks}
    
    Available Resources:
    ${resources}
    
    Provide the output as a JSON object that strictly adheres to the provided schema. The summary should be a brief, high-level overview of the allocation strategy.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        allocations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    resourceName: { type: Type.STRING },
                                    resourceType: { type: Type.STRING, enum: ["Labor", "Equipment"] },
                                    assignedTask: { type: Type.STRING },
                                    shift: { type: Type.STRING, description: "e.g., 'Full Day', 'Morning', 'Afternoon'" }
                                },
                                required: ["resourceName", "resourceType", "assignedTask", "shift"]
                            }
                        },
                        summary: {
                            type: Type.STRING,
                            description: "A brief overview of the allocation plan."
                        }
                    },
                    required: ["allocations", "summary"]
                }
            }
        });
        return parseJsonResponse<AllocationPlan>(response.text, "Resource Allocation");
    } catch (error) {
        console.error("Error generating resource allocation:", error);
        return null;
    }
};
