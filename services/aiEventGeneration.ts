import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';
import { getEventImage } from './imageService'

export interface GeneratedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  currentAttendees: number;
  maxAttendees: number;
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
console.log(GEMINI_API_KEY);

export async function generateEvents(count: number = 3): Promise<GeneratedEvent[]> {
  try {
    const prompt = `Generate ${count} community events as a JSON array. Return ONLY the raw JSON array without any markdown formatting or code blocks. Include these fields: title (string), date (string in format 'Day, Month DD, YYYY • HH:MM AM/PM'), location (string), description (string). Also please make the events as unique as possible each time. Also can they be Oxford locations and Oxford venues/ cafes/ etc. Can all events be after sat 17 may 2025 as well!`;
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
        topP: 0.8,
        topK: 40,
      },
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const cleanJson = response.text()
      .replace(/```json\n?/, '') 
      .replace(/\n?```$/, '') 
      .trim(); 

    console.log('Clean JSON:', cleanJson); 
    try {
      const events = JSON.parse(cleanJson);

      const eventsWithImages = await Promise.all(
        events.map(async (event: any, index: number) => ({
          ...event,
          id: `event-${index + 1}`,
          imageUrl: await getEventImage(event),
          currentAttendees: Math.floor(Math.random() * 20),
          maxAttendees: 30,
        }))
      );

      return eventsWithImages;
    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      throw parseError;
    }
  } catch (error) {
    console.error('Failed to generate events:', error);
    throw error;
  }
}