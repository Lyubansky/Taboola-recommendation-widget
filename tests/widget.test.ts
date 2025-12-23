import { Widget } from '../src/widget.js';
import { fetchRecommendations } from '../src/api/index.js';
import { rendererRegistry } from '../src/renderers/registry.js';
import { WidgetConfig, Recommendation } from '../src/types.js';
import { SponsoredRenderer } from '../src/renderers/sponsored.js';

// Mock the API and registry
jest.mock('../src/api/index.js');
jest.mock('../src/renderers/registry.js');

describe('Widget', () => {
  let container: HTMLElement;
  let config: WidgetConfig;
  const mockFetchRecommendations = fetchRecommendations as jest.MockedFunction<typeof fetchRecommendations>;
  const mockRegistryGet = rendererRegistry.get as jest.MockedFunction<typeof rendererRegistry.get>;

  beforeEach(() => {
    // Create a real DOM element for testing
    container = document.createElement('div');
    document.body.appendChild(container);

    config = {
      source: 'taboola',
      publisherId: 'test-publisher',
      appType: 'desktop',
      apiKey: 'test-key',
      sourceId: 'test-source',
    };

    // Reset mocks
    jest.clearAllMocks();
    mockRegistryGet.mockImplementation((rec: Recommendation) => {
      return new SponsoredRenderer();
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Loading state', () => {
    it('should show loading state when fetching recommendations', async () => {
      // Delay the API response
      mockFetchRecommendations.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      new Widget(container, config);

      // Check loading state is shown immediately
      expect(container.innerHTML).toContain('Loading recommendations...');
      expect(container.innerHTML).toContain('taboola-widget-loading');
    });
  });

  describe('Empty array handling', () => {
    it('should not crash when API returns empty array', async () => {
      mockFetchRecommendations.mockResolvedValue([]);
      // widget is not used because DOM is observed
      const widget = new Widget(container, config);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Widget should render successfully with no items
      expect(container.querySelectorAll('.taboola-widget-item')).toHaveLength(0);
      expect(container.className).toBe('taboola-widget');
    });

    it('should render correct number of items', async () => {
      const recommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Article 1',
          description: 'Desc 1',
          imageUrl: 'img1.jpg',
          url: 'url1',
          origin: 'sponsored',
        },
        {
          id: '2',
          title: 'Article 2',
          description: 'Desc 2',
          imageUrl: 'img2.jpg',
          url: 'url2',
          origin: 'sponsored',
        },
      ];

      mockFetchRecommendations.mockResolvedValue(recommendations);

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockFetchRecommendations).toHaveBeenCalledWith(config);
      expect(container.querySelectorAll('.taboola-widget-item')).toHaveLength(2);
    });
  });

  describe('Error handling', () => {
    it('should not crash when API throws an error', async () => {
      const errorMessage = 'Network error';
      mockFetchRecommendations.mockRejectedValue(new Error(errorMessage));

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should show error state
      expect(container.innerHTML).toContain('taboola-widget-error');
      expect(container.innerHTML).toContain(errorMessage);
    });

    it('should show error state with error message', async () => {
      mockFetchRecommendations.mockRejectedValue(new Error('API request failed: 500 Internal Server Error'));

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(container.innerHTML).toContain('taboola-widget-error');
      expect(container.innerHTML).toContain('API request failed');
    });

    it('should handle non-Error objects gracefully', async () => {
      mockFetchRecommendations.mockRejectedValue('String error');

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(container.innerHTML).toContain('taboola-widget-error');
      expect(container.innerHTML).toContain('Failed to load recommendations');
    });
  });

  describe('Renderer handling', () => {
    it('should skip items it cannot render', async () => {
      const recommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Valid',
          description: 'Desc',
          imageUrl: 'img.jpg',
          url: 'url',
          origin: 'sponsored',
        },
        {
          id: '2',
          title: 'Invalid',
          description: 'Desc',
          imageUrl: 'img.jpg',
          url: 'url',
          origin: 'video', // No renderer registered
        },
      ];

      mockFetchRecommendations.mockResolvedValue(recommendations);
      
      // First call succeeds, second throws
      mockRegistryGet
        .mockReturnValueOnce(new SponsoredRenderer())
        .mockImplementationOnce(() => {
          throw new Error('No renderer found for origin: video');
        });

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should render only the valid item
      expect(container.querySelectorAll('.taboola-widget-item')).toHaveLength(1);
    });

    it('should call fetchRecommendations with correct config', async () => {
      mockFetchRecommendations.mockResolvedValue([]);

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockFetchRecommendations).toHaveBeenCalledWith(config);
      expect(mockFetchRecommendations).toHaveBeenCalledTimes(1);
    });
  });

  describe('Widget initialization', () => {
    it('should set container class name', async () => {
      mockFetchRecommendations.mockResolvedValue([]);

      new Widget(container, config);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(container.className).toBe('taboola-widget');
    });
  });
});

