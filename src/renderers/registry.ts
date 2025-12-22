// Renderer registry for mapping recommendation types to renderers
import { Renderer } from './base.js';
import { SponsoredRenderer } from './sponsored.js';
import { OrganicRenderer } from './organic.js';
import { Recommendation } from '../types.js';





/**
 * Registry that maps recommendation origin types to their renderers.
 * Allows adding new recommendation types without modifying widget logic.
 */
class RendererRegistry {
  private renderers: Map<string, Renderer> = new Map();

  constructor() {
    // Register default renderers
    this.register('sponsored', new SponsoredRenderer());
    this.register('organic', new OrganicRenderer());
  }

  /**
   * Registers a renderer for a given recommendation origin.
   * New recommendation types can be added by calling this method.
   */
  register(origin: string, renderer: Renderer): void {
    this.renderers.set(origin, renderer);
  }

  /**
   * Returns the renderer responsible for the given recommendation.
   * Throws if no renderer is registered for the recommendation origin.
   */
  get(recommendation: Recommendation): Renderer {
    const renderer = this.renderers.get(recommendation.origin);
    if (!renderer) {
      throw new Error(`No renderer found for origin: ${recommendation.origin}`);
    }
    return renderer;
  }
}

// Export singleton instance
export const rendererRegistry = new RendererRegistry();

