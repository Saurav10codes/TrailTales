export async function generateScript(location: string, context: string): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  const endpoint = process.env.LLM_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions';
  
  if (!apiKey) throw new Error('LLM_API_KEY not configured');
  
  const systemPrompt = `You are an enthusiastic, documentary-style outdoor guide. Using the provided raw data about the location '${location}', write a 300-word audio script for a walker currently exploring the area. Focus on fascinating facts about the birds, plants, and geology specific to this exact location. Speak directly to the listener (e.g., 'As you walk around today, look out for...'). Do not use markdown, asterisks, sound effect cues, or visual formatting. Write only the spoken English words. Keep the tone conversational, awe-inspiring, and paced for audio.`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.8-27b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Location: ${location}\n\nContext:\n${context}` }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LLM request failed: ${error}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}
