// Sponsored recommendation renderer
import { Recommendation } from '../types.js';
import { BaseRenderer } from './base.js';

/**
 * Renderer for sponsored recommendations.
 * Responsible for building the DOM structure and handling click behavior.
 */
export class SponsoredRenderer extends BaseRenderer {
  /**
   * Renders a sponsored recommendation into a DOM element.
   */
  render(recommendation: Recommendation): HTMLElement {
    // Create the shared root container for the recommendation
    const container = this.createContainer(recommendation);
    
    // Image wrapper
    // Wrapper used to control aspect ratio and fallback styling
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'taboola-widget-item-image-wrapper';
    
    const img = document.createElement('img');
    img.src = recommendation.imageUrl;
    img.alt = recommendation.title;
    img.className = 'taboola-widget-item-image';
    // The browser loads the image only when it’s about to appear on screen
    img.loading = 'lazy'; // Improves performance by deferring offscreen images
    
    // Handle broken images
    img.onerror = () => {
      img.style.display = 'none';
      imageWrapper.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
    };
    
    imageWrapper.appendChild(img);
    
    // Content wrapper
    const content = document.createElement('div');
    content.className = 'taboola-widget-item-content';
    
    // Title
    const title = document.createElement('h3');
    title.className = 'taboola-widget-item-title';
    title.textContent = recommendation.title;
    
    // Description
    const description = document.createElement('p');
    description.className = 'taboola-widget-item-description';
    description.textContent = recommendation.description;
    
    // Branding (sponsored only)
    const branding = document.createElement('span');
    branding.className = 'taboola-widget-item-branding';
    branding.textContent = recommendation.branding || '';
    
    // Assemble content section
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(branding);

    // Assemble full recommendation card
    container.appendChild(imageWrapper);
    container.appendChild(content);
    
    return container;
  }
   /**
   * Handles click behavior for sponsored recommendations.
   * Sponsored links are opened in a new tab.
   */
  handleClick(recommendation: Recommendation): void {
    window.open(recommendation.url, '_blank');
  }
}

