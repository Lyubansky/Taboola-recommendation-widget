// Organic recommendation renderer
import { Recommendation } from '../types.js';
import { BaseRenderer } from './base.js';

/**
 * Renderer for organic recommendations
 * - Displays thumbnail, title, and description
 * - Opens links in the same tab
 */
export class OrganicRenderer extends BaseRenderer {
  render(recommendation: Recommendation): HTMLElement {
    const container = this.createContainer(recommendation);
    
    // Image wrapper
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'taboola-widget-item-image-wrapper';
    
    const img = document.createElement('img');
    img.src = recommendation.imageUrl;
    img.alt = recommendation.title;
    img.className = 'taboola-widget-item-image';
    img.loading = 'lazy';
    
    // Handle broken images gracefully
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
    
    content.appendChild(title);
    content.appendChild(description);
    
    container.appendChild(imageWrapper);
    container.appendChild(content);
    
    return container;
  }

  handleClick(recommendation: Recommendation): void {
    window.location.href = recommendation.url;
  }
}

