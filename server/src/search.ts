import { z } from 'zod';

export async function searchLocalEcosystem(location: string): Promise<string> {
  const queries = [
    `site:ebird.org OR site:inaturalist.org wildlife near ${location}`,
    `geological history and formations of ${location}`,
    `native plants and trees in ${location}`
  ];

  const searchPromises = queries.map(query => searchSerpApi(query));
  const results = await Promise.all(searchPromises);
  
  return results.join('\n\n');
}

async function searchSerpApi(query: string): Promise<string> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error('SERPAPI_KEY not configured');
  
  const url = new URL('https://serpapi.com/search');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('num', '3');
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`SerpApi failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  const snippets = (data.organic_results || [])
    .slice(0, 3)
    .map((r: any) => r.snippet || '')
    .filter(Boolean)
    .join('\n');
  
  return `Query: ${query}\n${snippets}`;
}
