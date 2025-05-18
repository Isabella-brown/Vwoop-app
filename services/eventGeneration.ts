import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded Gemini API Key for debugging purposes
const GEMINI_API_KEY = 'AIzaSyCaQYTK3RrEFz6VOgsfxi8Q-srTX8uZ6pM';

// Initialize Gemini
// Removed console log for API key value as it's hardcoded now
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define our event type
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
  capacity: number;
  currentAttendees: number;
  type: 'food' | 'outdoor' | 'indoor' | 'sports' | 'community';
  startTime: string;
  endTime: string;
}

// Helper function to get current time and format it
function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Helper function to get time of day
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Helper function to get day of week
function getDayOfWeek(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

// Function to generate events using Gemini
export async function generateEvents(count: number = 3, userLocation: string): Promise<Event[]> {
  try {
    console.log('🔄 Generating new events...');

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const timeOfDay = getTimeOfDay();
    const dayOfWeek = getDayOfWeek();
    const currentTime = getCurrentTime();

    const prompt = `
Generate ${count} spontaneous events for ${userLocation} around ${timeOfDay} on ${dayOfWeek}.
Current time is ${currentTime}.

Requirements:
- Events should be casual and spontaneous
- No official organizers needed
- Appropriate for the current time of day
- Realistic gathering sizes (4-12 people)
- Mix of indoor and outdoor activities
- Include specific locations in ${userLocation}
- Events should start within the next 10 hours

For each event, provide:
1. Title
2. Description
3. Location (specific place in ${userLocation})
4. Type (food/outdoor/indoor/sports/community)
5. Capacity (4-12 people)
6. Start time (within next 10 hours)
7. End time (1-3 hours after start)

Format the response as a JSON array of events.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('Raw Gemini response text before cleaning:', text);

    // Clean the response: remove markdown code block if present
    if (text.startsWith('```json')) {
      text = text.substring(7, text.lastIndexOf('```')).trim();
    } else if (text.startsWith('```')) {
       // Handle cases where it might just be ``` without json
       text = text.substring(3, text.lastIndexOf('```')).trim();
    }

    console.log('Cleaned Gemini response text before parsing:', text);

    // Parse the JSON response
    const events = JSON.parse(text);

    // Add metadata to each event
    const processedEvents = events.map((event: any) => ({
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currentAttendees: Math.floor(Math.random() * event.capacity),
      imageUrl: `https://source.unsplash.com/random/800x600?${encodeURIComponent(event.title)}&t=${Date.now()}`
    }));

    console.log('✅ Generated new events:', processedEvents.map((e: Event) => e.title));
    return processedEvents; // Cast to Event[]
  } catch (error) {
    console.error('❌ Error in generateEvents:', error);
    throw new Error('Failed to generate events. Please try again later.');
  }
}

// Function to sign up for an event
export async function signUpForEvent(eventId: string): Promise<boolean> {
  return true;
} 