// Taboola API client
import { Recommendation, ApiResponse, WidgetConfig } from '../types.js';
import { DEBUG } from '../config.js';

/**
 * Builds the Taboola API URL with query parameters
 * Exported for testing purposes
 */
export function buildTaboolaUrl(config: WidgetConfig): string {
  const count = config.count || 4;
  const sourceTypeParam = config.sourceType ? `&source.type=${config.sourceType}` : '';
  const sourceUrlParam = config.sourceUrl ? `&source.url=${config.sourceUrl}` : '';
  
  return `http://api.taboola.com/1.0/json/${config.publisherId}/recommendations.get?app.type=${config.appType}&app.apikey=${config.apiKey}&count=${count}${sourceTypeParam}&source.id=${config.sourceId}${sourceUrlParam}`;
}

/**
 * Fetches recommendations from the Taboola API
 * @param config - Widget configuration parameters
 * @returns Promise resolving to an array of normalized recommendations
 */
export async function fetchTaboolaRecommendations(config: WidgetConfig): Promise<Recommendation[]> {
  const url = buildTaboolaUrl(config);

  if (DEBUG) {
    console.log('API URL:', url);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Taboola API error: ${response.status} ${response.statusText}`
    );
  }
  // without await response.json() will return a promise, not the data
  const data: ApiResponse = await response.json();

  if (DEBUG) {
    console.log('Raw API Response:', data);
  }

  return normalizeTaboolaResponse(data);
}

/**
 * Normalizes the raw Taboola API response into our internal Recommendation format
 * @param response - Raw API response
 * @returns Array of normalized recommendations
 */
export function normalizeTaboolaResponse(response: ApiResponse): Recommendation[] {
  if (!Array.isArray(response.list)) {
    return [];
  }

  return response.list.map((item) => {
    const imageUrl = item.thumbnail?.[0]?.url ?? '';
    
    return {
      id: item.id ?? '',
      title: item.name ?? '',
      description: item.description ?? '',
      imageUrl: imageUrl,
      url: item.url ?? '',
      origin: item.origin,
      ...(item.origin === 'sponsored' && item.branding ? { branding: item.branding } : {}),
    };
  });
}
