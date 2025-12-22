// Base renderer interface and common functionality
import { Recommendation } from '../types.js';

/**
 * Base interface for all recommendation renderers
 */
export interface Renderer {
  /**
   * Renders a recommendation into a DOM element
   * @param recommendation - The recommendation to render
   * @returns HTMLElement representing the recommendation
   */
  render(recommendation: Recommendation): HTMLElement;

  /**
   * Handles click events for a recommendation
   * @param recommendation - The recommendation that was clicked
   */
  handleClick(recommendation: Recommendation): void;
}

/**
 * Base renderer class with common functionality
 */
export abstract class BaseRenderer implements Renderer {
  abstract render(recommendation: Recommendation): HTMLElement;
  abstract handleClick(recommendation: Recommendation): void;

  /**
   * Creates the shared root DOM element for a recommendation.
   * Used by all renderers to ensure consistent structure and event handling.
   */
  protected createContainer(recommendation: Recommendation): HTMLElement {
    const container = document.createElement('div');
    // Add a class for styling and identification
    container.className = 'taboola-widget-item';
    container.setAttribute('data-recommendation-id', recommendation.id);
    container.setAttribute('data-origin', recommendation.origin);
    return container;
  }
}

