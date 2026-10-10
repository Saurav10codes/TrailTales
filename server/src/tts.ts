import { pipeline } from '@huggingface/transformers';
import wavefile from 'wavefile';

let synthesizer: any = null;

async function getSynthesizer() {
  if (!synthesizer) {
    console.log('Loading TTS model...');
    synthesizer = await pipeline('text-to-speech', 'Xenova/speecht5_tts', { 
      dtype: 'fp32',
      progress_callback: (progress: any) => {
        if (progress.status === 'progress') {
          console.log(`Loading: ${Math.round(progress.progress * 100)}%`);
        }
      }
    });
    console.log('TTS model loaded');
  }
  return synthesizer;
}

export async function synthesizeAudio(text: string): Promise<Buffer> {
  const synth = await getSynthesizer();
  
  // Speaker embeddings URL
  const speaker_embeddings = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin';
  
  console.log('Generating speech...');
  const result = await synth(text, { speaker_embeddings });
  
  // Convert to WAV format
  const wav = new wavefile.WaveFile();
  wav.fromScratch(1, result.sampling_rate, '32f', result.audio);
  
  console.log('Audio generated successfully');
  return Buffer.from(wav.toBuffer());
}
