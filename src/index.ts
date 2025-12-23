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

  // Initialize widget
  new TaboolaWidget(container, defaultConfig);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

