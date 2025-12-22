// Entry point for the Taboola recommendation widget
import { TaboolaWidget } from './widget.js';
import { WidgetConfig } from './types.js';
import { defaultConfig } from './config.js';

/**
 * Initializes the widget on page load
 */
function init(): void {
  const container = document.getElementById('taboola-widget');
  if (!container) {
    console.error('Taboola widget container not found');
    return;
  }

  // Merge with any custom config from data attributes
  const customConfig: Partial<WidgetConfig> = {};
  if (container.dataset.publisherId) customConfig.publisherId = container.dataset.publisherId;
  if (container.dataset.appType) customConfig.appType = container.dataset.appType;
  if (container.dataset.apiKey) customConfig.apiKey = container.dataset.apiKey;
  if (container.dataset.sourceId) customConfig.sourceId = container.dataset.sourceId;
  if (container.dataset.sourceType) customConfig.sourceType = container.dataset.sourceType;
  if (container.dataset.sourceUrl) customConfig.sourceUrl = container.dataset.sourceUrl;
  if (container.dataset.count) customConfig.count = parseInt(container.dataset.count, 10);

  const config = { ...defaultConfig, ...customConfig };

  // Initialize widget
  new TaboolaWidget(container, config);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

