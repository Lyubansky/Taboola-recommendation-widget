// Configuration for Taboola Recommendation Widget


import { WidgetConfig } from './types.js';

/**
 * Debug flag for console logging
 * Set to true to enable debug logs, false to disable
 */
export const DEBUG = false;

/**
 * Default widget configuration
 * These values can be overridden via data attributes on the widget container element
 */
export const defaultConfig: WidgetConfig = {
  source: 'taboola',
  publisherId: 'taboola-templates',
  appType: 'desktop',
  apiKey: 'REPLACE_WITH_YOUR_API_KEY',
  sourceId: 'demo-source-id',
  sourceType: 'video',  
  sourceUrl: window.location.href,
  count: 4,
};

