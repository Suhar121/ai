import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, TourPackage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const tourPackageSchema = {
  type: Type.OBJECT,
  properties: {
    packageName: { type: Type.STRING, description: "A catchy name for the tour package." },
    location: { type: Type.STRING, description: "The destination city and country." },
    durationDays: { type: Type.INTEGER, description: "The total number of days for the trip." },
    overallDescription: { type: Type.STRING, description: "A brief, inviting summary of the entire trip experience."},
    totalPrice: { type: Type.NUMBER, description: "The total estimated price for the package." },
    currency: { type: Type.STRING, description: "The currency of the price (e.g., USD, EUR)." },
    priceBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Category of the expense (e.g., Flights, Hotel, Activities)." },
          cost: { type: Type.NUMBER, description: "Estimated cost for this item." },
          description: { type: Type.STRING, description: "Brief description of what this cost covers."}
        },
        required: ["item", "cost", "description"]
      }
    },
    suggestedHotel: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of a suggested hotel." },
        rating: { type: Type.STRING, description: "Star rating or type of the hotel (e.g., 4-star, Boutique)." },
        description: { type: Type.STRING, description: "Brief description of the hotel and its amenities." },
        estimatedPricePerNight: { type: Type.NUMBER, description: "Estimated price per night for the hotel."}
      },
      required: ["name", "rating", "description", "estimatedPricePerNight"]
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number of the itinerary." },
          title: { type: Type.STRING, description: "A theme or title for the day's activities." },
          activities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of activities and sights for the day."
          }
        },
        required: ["day", "title", "activities"]
      }
    }
  },
  required: ["packageName", "location", "durationDays", "overallDescription", "totalPrice", "currency", "priceBreakdown", "suggestedHotel", "itinerary"]
};

const createPrompt = (formState: FormState): string => {
  return `
    Act as an expert travel agent. Generate a detailed and exciting tour package based on the following criteria:

    - **Destination:** ${formState.location}
    - **Duration:** ${formState.days} days
    - **Number of Travelers:** ${formState.travelers}
    - **Hotel Preference:** ${formState.hotel}

    Please create a complete package including a creative package name, a day-by-day itinerary, a suitable hotel suggestion, and a detailed price breakdown. The tone should be enthusiastic and appealing to a traveler. Ensure all prices are estimated and clearly stated. The total price should be the sum of the price breakdown items. The hotel suggestion must match the requested preference. The itinerary should be logical for the duration and location.
  `;
};

export const generateImageForPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A vibrant, photorealistic, high-quality photograph representing: "${prompt}". Centered, well-lit, travel photography style.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.warn(`Image generation failed for prompt: ${prompt}`);
      return 'placeholder.png'; 
    }
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    return 'placeholder.png';
  }
};

export const generateTourPackage = async (formState: FormState): Promise<TourPackage> => {
  const prompt = createPrompt(formState);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tourPackageSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPackage = JSON.parse(jsonText) as TourPackage;

    if (!parsedPackage.packageName || !parsedPackage.itinerary || !parsedPackage.totalPrice) {
      throw new Error("Received incomplete tour package data from the API.");
    }

    return parsedPackage;
  } catch (error) {
    console.error("Error generating tour package:", error);
    throw new Error("Failed to generate tour package. The AI model may be temporarily unavailable. Please try again later.");
  }
};