// API router - routes to the correct API based on config.source
import { WidgetConfig, Recommendation } from '../types.js';
import { fetchTaboolaRecommendations } from './taboola.js';

/**
 * Fetches recommendations from the appropriate API based on config.source
 * @param config - Widget configuration with source field
 * @returns Promise resolving to an array of normalized recommendations
 */
export async function fetchRecommendations(config: WidgetConfig): Promise<Recommendation[]> {
  switch (config.source) {
    case 'taboola':
      return fetchTaboolaRecommendations(config);
    case 'organic':
      throw new Error('Organic API not yet implemented');
    case 'video':
      throw new Error('Video API not yet implemented');
    default:
      throw new Error(`Unknown source: ${config.source}`);
  }
}

