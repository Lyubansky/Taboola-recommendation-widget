// Type definitions for the Taboola recommendation widget
// Decoupling the widget from the API response

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  origin: string;
  branding?: string; 
}

export interface ApiResponse {
  id: string;
  list: Array<{
    id: string;
    name: string;
    description: string;
    thumbnail: Array<{
      url: string;
      width?: string;
      height?: string;
    }>;
    url: string;
    origin: string;
    branding?: string;
  }>;
}

export interface WidgetConfig {
  source: 'taboola' | 'organic' | 'video'; // extensible
  publisherId: string;
  appType: string;
  apiKey: string;
  sourceId: string;
  sourceType?: string;
  sourceUrl?: string;
  count?: number;
}

