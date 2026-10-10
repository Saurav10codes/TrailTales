# Hyper-Local Ecosystem Podcast Generator

A stateless web app that generates personalized audio podcasts about local flora, fauna, and geology based on your location.

## Architecture

- `/server` - Node.js/Express backend with TypeScript
- `/client` - Vite + React frontend with neo-brutalism UI

## Setup

### Prerequisites
- Node.js 18+
- API keys for: SerpApi, LLM provider (Groq/DigitalOcean)

### Environment Variables

1. Copy the example env file:
```bash
cp server/.env.example server/.env
```

2. Fill in your API keys in `server/.env`:
- `SERPAPI_KEY` - Get from [serpapi.com](https://serpapi.com)
- `LLM_API_KEY` - Your LLM provider API key
- `LLM_ENDPOINT` - LLM API endpoint (defaults to Groq)

### Installation

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

### Running the App

Terminal 1 (Server):
```bash
cd server && npm run dev
```

Terminal 2 (Client):
```bash
cd client && npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## How It Works

1. User enters a location
2. Server searches for local ecosystem data via SerpApi (wildlife, geology, plants)
3. LLM writes a 300-word documentary-style script
4. Hugging Face TTS synthesizes the script into audio
5. Audio is returned to the user for playback

## API Endpoints

### POST /api/generate-podcast

Request:
```json
{
  "location": "Central Park, New York"
}
```

Response: Audio buffer (MPEG)

## Tech Stack

- **Backend**: Express, TypeScript
- **Frontend**: Vite, React, Tailwind CSS
- **APIs**: SerpApi, Hugging Face Inference API, LLM (Llama 3.3)
