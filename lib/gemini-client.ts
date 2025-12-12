/**
 * Gemini AI Client
 * Handles chat interactions with Google's Gemini API
 */

import { MATTHEW_SYSTEM_PROMPT } from "./system-prompt";

interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash"; // Current stable model from Google
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function sendMessageToGemini(
  messages: GeminiMessage[],
  userMessage: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const messageHistory: GeminiMessage[] = [
    ...messages,
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: MATTHEW_SYSTEM_PROMPT,
            },
          ],
        },
        contents: messageHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini API error: ${error.error?.message || response.statusText}`
      );
    }

    const data: GeminiResponse = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return aiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export function detectCalculationResponse(response: string): {
  isCalculation: boolean;
  data?: {
    taxType: string;
    totalAmount: number;
    currency: string;
    breakdown?: Record<string, any>;
    dueDate?: string;
    installments?: number;
  };
} {
  // Check for calculation keywords
  const calculationKeywords = [
    "tax",
    "calculate",
    "amount",
    "₦",
    "naira",
    "income",
    "paye",
    "cit",
    "cgt",
  ];
  const hasCalculationKeyword = calculationKeywords.some((keyword) =>
    response.toLowerCase().includes(keyword)
  );

  if (!hasCalculationKeyword) {
    return { isCalculation: false };
  }

  // Extract calculation data
  const amountMatch = response.match(/₦([\d,]+)/);
  const taxTypeMatch = response.match(/(PAYE|CIT|CGT|Business|Crypto)/i);
  const dueDateMatch = response.match(/due.*?(\d{4}-\d{2}-\d{2})/i);
  const installmentsMatch = response.match(/(\d+)\s*installments?/i);

  if (amountMatch) {
    const amountStr = amountMatch[1].replace(/,/g, "");
    const amount = parseInt(amountStr, 10);

    return {
      isCalculation: true,
      data: {
        taxType: taxTypeMatch ? taxTypeMatch[1].toUpperCase() : "TAX",
        totalAmount: amount,
        currency: "₦",
        breakdown: {
          gross: amount,
        },
        dueDate: dueDateMatch ? dueDateMatch[1] : undefined,
        installments: installmentsMatch
          ? parseInt(installmentsMatch[1], 10)
          : 3,
      },
    };
  }

  return { isCalculation: false };
}
