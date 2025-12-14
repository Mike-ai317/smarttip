import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptScanResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeReceipt = async (base64Image: string): Promise<ReceiptScanResult> => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing");
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG, but could be PNG. API is flexible.
              data: base64Image
            }
          },
          {
            text: `Analyze this receipt image. Extract the total bill amount (grand total) and the currency symbol used.
                   Return the result strictly as JSON.`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total: { type: Type.NUMBER, description: "The grand total amount found on the receipt" },
            currency: { type: Type.STRING, description: "The currency symbol (e.g., $, €, £)" }
          },
          required: ["total", "currency"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const result = JSON.parse(text) as ReceiptScanResult;
    return result;

  } catch (error) {
    console.error("Error analyzing receipt:", error);
    throw error;
  }
};
