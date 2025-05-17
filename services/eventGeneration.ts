import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env'

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
console.log(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
/*
const sampleEvents: GeneratedEvent[] = [
  {
    id: '1',
    title: 'Community Garden Cleanup',
    date: 'Saturday, March 23, 2024 • 10:00 AM',
    location: 'Central Park Community Garden',
    description: 'Join us for a morning of gardening and community building. We\'ll be planting spring vegetables and cleaning up the garden beds. Tools and refreshments provided!',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
    currentAttendees: 12,
    maxAttendees: 20,
  },
  {
    id: '2',
    title: 'Local Art Exhibition',
    date: 'Sunday, March 24, 2024 • 2:00 PM',
    location: 'Downtown Art Gallery',
    description: 'Experience the work of local artists in our monthly exhibition. Meet the artists, enjoy live music, and participate in interactive art workshops.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    currentAttendees: 45,
    maxAttendees: 50,
  },
  {
    id: '3',
    title: 'Neighborhood Book Club',
    date: 'Tuesday, March 26, 2024 • 7:00 PM',
    location: 'Community Library',
    description: 'This month we\'re discussing "The Midnight Library" by Matt Haig. New members welcome! Light refreshments will be served.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
    currentAttendees: 8,
    maxAttendees: 15,
  },
  {
    id: '4',
    title: 'Crochet',
    date: 'Tuesday, March 27, 2024 • 7:00 PM',
    location: 'Community Library',
    description: 'Crochet.',
    imageUrl: 'https://images.unsplash.com/photo-1519412849983-957822373d02?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    currentAttendees: 8,
    maxAttendees: 15,
  },
  {
    id: '5',
    title: 'Painting Workshop',
    date: 'Thursday, March 28, 2024 • 6:00 PM',
    location: 'Some place',
    description: 'Painting.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664303562514-3a923e14732e?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    currentAttendees: 8,
    maxAttendees: 15,
  },
];
*/
export async function generateEvents(count: number = 3): Promise<GeneratedEvent[]> {
  try {
    const prompt = `Generate ${count} community events as a JSON array. Return ONLY the raw JSON array without any markdown formatting or code blocks. Include these fields: title (string), date (string in format 'Day, Month DD, YYYY • HH:MM AM/PM'), location (string), description (string). Also please make the events as unique as possible each time. Also can they be Oxford locations and Oxford venues/ cafes/ etc`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;

    
    // Clean the response text
    const cleanJson = response.text()
      .replace(/```json\n?/, '')  // Remove opening markdown
      .replace(/\n?```$/, '')     // Remove closing markdown
      .trim();                    // Remove extra whitespace
    
      console.log('Clean JSON:', cleanJson); // Log the cleaned JSON for debugging
    try {
      const events = JSON.parse(cleanJson);
      return events.map((event: any, index: number) => ({
        ...event,
        id: `event-${index + 1}`,
        imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(event.title)}`,
        currentAttendees: Math.floor(Math.random() * 20),
        maxAttendees: 30,
      }));
    } catch (parseError) {
      console.error('JSON Parse error:', parseError, 'Raw response:', cleanJson);
      throw parseError;
    }
  } catch (error) {
    console.error('Failed to generate events:', error);
    throw new Error('Failed to generate events');
    // Return shuffled sample events as fallback
   /* return [...sampleEvents]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((event, index) => ({
        ...event,
        id: `event-${index + 1}`,
        currentAttendees: Math.floor(Math.random() * event.maxAttendees)
      }));*/
  }
}