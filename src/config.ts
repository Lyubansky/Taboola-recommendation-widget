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
  apiKey: 'f9040ab1b9c802857aa783c469d0e0ff7e7366e4',
  sourceId: 'demo-source-id',
  sourceType: 'video',  
  sourceUrl: window.location.href,
  count: 4,
};

