
import { GoogleGenAI, Type } from "@google/genai";
import {
  ContentRequest,
  ContentOutput,
  CampaignObjective,
  CampaignPlan,
  SEOCluster,
  SEOOutline,
} from "../types";

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

const getClient = () => {
  const apiKey = (process.env.API_KEY as string | undefined) || (process.env.GEMINI_API_KEY as string | undefined);
  if (!apiKey) {
    throw new Error("Missing API key. Set GEMINI_API_KEY in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingContent = async (
  request: ContentRequest
): Promise<ContentOutput | null> => {
  const ai = getClient();
  const prompt = `You are a senior marketing copywriter. Generate high-quality ${request.format} content for the topic "${request.topic}".

Audience: ${request.audience}
Tone: ${request.tone}
Desired Length: ${request.length ?? "Medium"}
Primary Keywords: ${(request.keywords ?? []).join(", ")}
Call To Action: ${request.callToAction ?? ""}

Return a JSON object exactly matching the provided schema. Avoid markdown fences.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            body: { type: Type.STRING },
            seoMeta: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "description", "keywords"],
            },
            variants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  body: { type: Type.STRING },
                  channel: {
                    type: Type.STRING,
                    enum: ["LinkedIn", "X", "Instagram", "Facebook"],
                  },
                },
                required: ["headline", "body", "channel"],
              },
            },
          },
          required: ["title", "summary", "body", "seoMeta"],
        },
      },
    });
    return parseJsonResponse<ContentOutput>(response.text, "Marketing Content");
  } catch (error) {
    console.error("Error generating marketing content:", error);
    return null;
  }
};

export const planCampaign = async (
  campaignName: string,
  objective: CampaignObjective,
  targetAudience: string,
  themes: string[],
  channels: string[]
): Promise<CampaignPlan | null> => {
  const ai = getClient();
  const prompt = `You are a senior marketing strategist. Build a coherent campaign plan.

Campaign: ${campaignName}
Objective: ${objective}
Target Audience: ${targetAudience}
Key Themes: ${themes.join(", ")}
Preferred Channels: ${channels.join(", ")}

Plan a two-week content calendar with specific items per day, and include KPI targets. Output JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaignName: { type: Type.STRING },
            objective: {
              type: Type.STRING,
              enum: ["Awareness", "Engagement", "LeadGen", "Conversion"],
            },
            targetAudience: { type: Type.STRING },
            channels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  channel: {
                    type: Type.STRING,
                    enum: [
                      "Email",
                      "LinkedIn",
                      "X",
                      "Instagram",
                      "Blog",
                      "YouTube",
                      "Ads",
                    ],
                  },
                  cadence: { type: Type.STRING },
                  contentTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["channel", "cadence", "contentTypes"],
              },
            },
            contentCalendar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  channel: { type: Type.STRING },
                  contentTitle: { type: Type.STRING },
                  description: { type: Type.STRING },
                  owner: { type: Type.STRING },
                },
                required: ["date", "channel", "contentTitle"],
              },
            },
            kpis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  target: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                },
                required: ["name", "target", "unit"],
              },
            },
            brief: { type: Type.STRING },
          },
          required: [
            "campaignName",
            "objective",
            "targetAudience",
            "channels",
            "contentCalendar",
            "kpis",
            "brief",
          ],
        },
      },
    });
    return parseJsonResponse<CampaignPlan>(response.text, "Campaign Plan");
  } catch (error) {
    console.error("Error generating campaign plan:", error);
    return null;
  }
};

export const generateSEOAssist = async (
  seedKeyword: string,
  audience: string
): Promise<{ clusters: SEOCluster[]; outline: SEOOutline } | null> => {
  const ai = getClient();
  const prompt = `You are an SEO expert. Build keyword clusters around the seed and provide a robust article outline.

Seed Keyword: ${seedKeyword}
Target Audience: ${audience}

Return JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  seedKeyword: { type: Type.STRING },
                  intent: {
                    type: Type.STRING,
                    enum: [
                      "Informational",
                      "Transactional",
                      "Navigational",
                      "Commercial",
                    ],
                  },
                  cluster: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        keyword: { type: Type.STRING },
                        volume: { type: Type.NUMBER },
                        difficulty: { type: Type.NUMBER },
                        intent: { type: Type.STRING },
                      },
                      required: ["keyword", "volume", "difficulty", "intent"],
                    },
                  },
                },
                required: ["seedKeyword", "intent", "cluster"],
              },
            },
            outline: {
              type: Type.OBJECT,
              properties: {
                h1: { type: Type.STRING },
                metaTitle: { type: Type.STRING },
                metaDescription: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      h2: { type: Type.STRING },
                      bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["h2", "bullets"],
                  },
                },
                faqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                    },
                    required: ["question", "answer"],
                  },
                },
                internalLinks: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["h1", "metaTitle", "metaDescription", "sections", "faqs"],
            },
          },
          required: ["clusters", "outline"],
        },
      },
    });
    return parseJsonResponse<{ clusters: SEOCluster[]; outline: SEOOutline }>(
      response.text,
      "SEO Assistant"
    );
  } catch (error) {
    console.error("Error generating SEO assistance:", error);
    return null;
  }
};
