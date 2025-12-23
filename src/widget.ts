// Main widget class
import { Recommendation, WidgetConfig } from './types.js';
import { fetchRecommendations } from './api/index.js';
import { rendererRegistry } from './renderers/registry.js';
import { DEBUG } from './config.js';

/**
 * Recommendation Widget - API-agnostic widget that renders recommendations
 */
export class Widget {
  private container: HTMLElement;
  private config: WidgetConfig;
  private recommendations: Recommendation[] = [];

  constructor(container: HTMLElement, config: WidgetConfig) {
    this.container = container;
    this.config = config;
    this.init();
  }

  /**
   * Initializes the widget
   */
  private init(): void {
    this.container.className = 'taboola-widget';
    this.attachEventListeners();
    this.loadRecommendations();
  }

  /**
   * Loads recommendations from the API
   */
  private async loadRecommendations(): Promise<void> {
    try {
      this.showLoading();
      if (DEBUG) {
        console.log('⚙️ Config:', this.config);
      }
      const recommendations = await fetchRecommendations(this.config);
      if (DEBUG) {
        console.log('API Response received:', recommendations);
        console.log('Number of recommendations:', recommendations.length);
      }
      
      // Store recommendations - renderer registry will handle finding appropriate renderers
      this.recommendations = recommendations;
      
      this.render();
    } catch (error) {
      console.error('API Error:', error);
      this.showError(error instanceof Error ? error.message : 'Failed to load recommendations');
    }
  }

  /**
   * Renders all recommendations using a DocumentFragment for performance.
   * Each recommendation is rendered into a DOM element and appended to a temporary
   * container (the fragment). Then the fragment is appended to the widget container,
   * which moves all those elements into the widget and the fragment itself disappears.
   */
  private render(): void {
    // Clear container
    this.container.innerHTML = '';

    // Create document fragment for performance
    const fragment = document.createDocumentFragment();

    // Render each recommendation
    this.recommendations.forEach((recommendation) => {
      try {
        const renderer = rendererRegistry.get(recommendation);
        const element = renderer.render(recommendation);
        // Adds each rendered recommendation to a temporary container
        // Happens off-DOM, so it’s fast
        // Does not trigger layout or paint, just collecting elements
        fragment.appendChild(element);
      } catch (error) {
        // No renderer found for this origin - skip it
        // This allows extensibility: add new renderer types without modifying widget
        if (DEBUG) {
          console.warn(`Skipping recommendation with origin "${recommendation.origin}" - no renderer registered`);
        }
      }
    });

    // Moves all collected elements at once into the widget container
    this.container.appendChild(fragment);
  }

  /**
   * Attaches a single click listener to the widget container.
   * Uses event delegation so dynamically rendered recommendations
   * do not need individual listeners.
   */
  private attachEventListeners(): void {
    // Listen for any click inside the widget container
    this.container.addEventListener('click', (event) => {
      // The actual element that was clicked (could be image, text, etc.)
      const target = event.target as HTMLElement;
      // Find the closest parent element that represents a recommendation item
      // Each recommendation element has a data-recommendation-id attribute
      const item = target.closest('[data-recommendation-id]') as HTMLElement;

      // If the click was not inside a recommendation item, ignore it
      if (!item) return;
      // Read the recommendation ID from the DOM element (which is the parent of the clicked element)
      const recommendationId = item.getAttribute('data-recommendation-id');
      if (!recommendationId) return;
      // Find the recommendation object in the recommendations array
      const recommendation = this.recommendations.find((rec) => rec.id === recommendationId);
      if (!recommendation) return;

      // Get the appropriate renderer for this recommendation
      const renderer = rendererRegistry.get(recommendation);
      // Let the renderer handle the click behavior
      renderer.handleClick(recommendation);
    });
  }

  /**
   * Shows loading state
   */
  private showLoading(): void {
    this.container.innerHTML = '<div class="taboola-widget-loading">Loading recommendations...</div>';
  }

  /**
   * Shows error state
   */
  private showError(message: string): void {
    this.container.innerHTML = `<div class="taboola-widget-error">${message}</div>`;
  }
}

