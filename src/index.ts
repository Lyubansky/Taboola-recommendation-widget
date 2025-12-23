// Entry point for the recommendation widget
import { Widget } from './widget.js';
import { WidgetConfig } from './types.js';
import { defaultConfig } from './config.js';

/**
 * Initializes the widget on page load
 */
function init(): void {
  const container = document.getElementById('taboola-widget');
  if (!container) {
    console.error('Widget container not found');
    return;
  }

  // Initialize widget
  new Widget(container, defaultConfig);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

