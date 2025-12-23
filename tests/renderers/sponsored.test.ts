import { SponsoredRenderer } from '../../src/renderers/sponsored.js';
import { Recommendation } from '../../src/types.js';

describe('SponsoredRenderer', () => {
  let renderer: SponsoredRenderer;
  let mockWindowOpen: jest.SpyInstance;

  beforeEach(() => {
    renderer = new SponsoredRenderer();
    mockWindowOpen = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    mockWindowOpen.mockRestore();
  });

  describe('handleClick', () => {
    it('should open URL in new tab', () => {
      const recommendation: Recommendation = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        imageUrl: 'img.jpg',
        url: 'http://example.com',
        origin: 'sponsored',
        branding: 'Brand',
      };

      renderer.handleClick(recommendation);

      expect(mockWindowOpen).toHaveBeenCalledWith('http://example.com', '_blank');
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
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
        origin: 'sponsored',
        branding: 'Test Brand',
      };

      const element = renderer.render(recommendation);

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.className).toBe('taboola-widget-item');
      expect(element.getAttribute('data-recommendation-id')).toBe('1');
      expect(element.getAttribute('data-origin')).toBe('sponsored');
    });

    it('should include branding element for sponsored items', () => {
      const recommendation: Recommendation = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        imageUrl: 'img.jpg',
        url: 'url',
        origin: 'sponsored',
        branding: 'Brand Name',
      };

      const element = renderer.render(recommendation);
      const branding = element.querySelector('.taboola-widget-item-branding');

      expect(branding).not.toBeNull();
      expect(branding?.textContent).toBe('Brand Name');
    });

    it('should handle missing branding gracefully', () => {
      const recommendation: Recommendation = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        imageUrl: 'img.jpg',
        url: 'url',
        origin: 'sponsored',
      };

      const element = renderer.render(recommendation);
      const branding = element.querySelector('.taboola-widget-item-branding');

      expect(branding).not.toBeNull();
      expect(branding?.textContent).toBe('');
    });
  });
});

