import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePodcast } from './podcast.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/generate-podcast', async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    const audioBuffer = await generatePodcast(location);
    
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Podcast generation error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate podcast' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
