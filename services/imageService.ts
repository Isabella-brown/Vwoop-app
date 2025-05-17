import { UNSPLASH_ACCESS_KEY } from '@env';

export async function getEventImage(event: { title: string; location: string; description: string }): Promise<string> {
  try {
    // Construct search terms from event details
    const searchTerms = [
      event.title,
      event.location.split(',')[0], // Use first part of location
      ...event.description.split(' ').slice(0, 3) // First 3 words of description
    ].join(' ');

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerms)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Image fetch error:', error);
    // Fallback to a default image based on event type
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(event.title)}`;
  }
}