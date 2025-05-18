# Vwoop - Community Events App

A React Native application that generates and displays community events using Google's Gemini AI.

## Features

- AI-powered event generation using Google's Gemini API
- Pull-to-refresh functionality to generate new events
- Event sign-up system
- Modern, responsive UI
- Cross-platform (iOS & Android) support

## Prerequisites

- Node.js >= 18
- React Native development environment set up
- Google Gemini API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   UNSPLASH_API_KEY=your_unsplash_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on Android:
   ```bash
   npm run android
   ```

   Or iOS:
   ```bash
   npm run ios
   ```

## Environment Variables

The following environment variables are required:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `UNSPLASH_API_KEY` (optional): Your Unsplash API key for event images

## Project Structure

- `/components`: React Native components
- `/services`: Business logic and API integration
- `/types`: TypeScript type definitions
- `/assets`: Static assets

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 