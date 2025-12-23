import { OrganicRenderer } from '../../src/renderers/organic.js';
import { Recommendation } from '../../src/types.js';

describe('OrganicRenderer', () => {
  let renderer: OrganicRenderer;

  beforeEach(() => {
    renderer = new OrganicRenderer();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });
  });

  describe('handleClick', () => {
    it('should navigate to URL in same tab', () => {
      const recommendation: Recommendation = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        imageUrl: 'img.jpg',
        url: 'http://example.com',
        origin: 'organic',
      };

      renderer.handleClick(recommendation);

      expect(window.location.href).toBe('http://example.com');
    });
  });

  describe('render', () => {
    it('should create DOM element with correct structure', () => {
      const recommendation: Recommendation = {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        imageUrl: 'http://example.com/image.jpg',
        url: 'http://example.com',
        origin: 'organic',
      };

      const element = renderer.render(recommendation);

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.className).toBe('taboola-widget-item');
      expect(element.getAttribute('data-recommendation-id')).toBe('1');
      expect(element.getAttribute('data-origin')).toBe('organic');
    });

    it('should not include branding element for organic items', () => {
      const recommendation: Recommendation = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        imageUrl: 'img.jpg',
        url: 'url',
        origin: 'organic',
      };

      const element = renderer.render(recommendation);
      const branding = element.querySelector('.taboola-widget-item-branding');

      expect(branding).toBeNull();
    });
  });
});

