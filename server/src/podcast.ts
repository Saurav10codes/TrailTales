import { searchLocalEcosystem } from './search.js';
import { generateScript } from './llm.js';
import { synthesizeAudio } from './tts.js';

export async function generatePodcast(location: string): Promise<Buffer> {
  // Step 1: Search for ecosystem data
  const context = await searchLocalEcosystem(location);
  
  if (!context || context.trim().length < 50) {
    throw new Error('Insufficient ecosystem data found for this location');
  }
  
  // Step 2: Generate script using LLM
  const script = await generateScript(location, context);
  
  // Step 3: Synthesize audio
  const audioBuffer = await synthesizeAudio(script);
  
  return audioBuffer;
}
