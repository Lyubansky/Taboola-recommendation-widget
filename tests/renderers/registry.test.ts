import { rendererRegistry } from '../../src/renderers/registry.js';
import { SponsoredRenderer } from '../../src/renderers/sponsored.js';
import { OrganicRenderer } from '../../src/renderers/organic.js';
import { Recommendation } from '../../src/types.js';

describe('RendererRegistry', () => {
  const sponsoredRecommendation: Recommendation = {
    id: '1',
    title: 'Sponsored Article',
    description: 'Description',
    imageUrl: 'img.jpg',
    url: 'http://example.com',
    origin: 'sponsored',
    branding: 'Brand',
  };

  const organicRecommendation: Recommendation = {
    id: '2',
    title: 'Organic Article',
    description: 'Description',
    imageUrl: 'img.jpg',
    url: 'http://example.com',
    origin: 'organic',
  };

  it('should return SponsoredRenderer for sponsored origin', () => {
    const renderer = rendererRegistry.get(sponsoredRecommendation);
    
    expect(renderer).toBeInstanceOf(SponsoredRenderer);
  });

  it('should return OrganicRenderer for organic origin', () => {
    const renderer = rendererRegistry.get(organicRecommendation);
    
    expect(renderer).toBeInstanceOf(OrganicRenderer);
  });

  it('should throw error for unregistered origin', () => {
    const unknownRecommendation: Recommendation = {
      id: '3',
      title: 'Unknown',
      description: 'Desc',
      imageUrl: 'img.jpg',
      url: 'url',
      origin: 'video',
    };

    expect(() => {
      rendererRegistry.get(unknownRecommendation);
    }).toThrow('No renderer found for origin: video');
  });

  it('should allow registering new renderers', () => {
    const mockRenderer = {
      render: jest.fn(),
      handleClick: jest.fn(),
    };

    rendererRegistry.register('video', mockRenderer);

    const videoRecommendation: Recommendation = {
      id: '4',
      title: 'Video',
      description: 'Desc',
      imageUrl: 'img.jpg',
      url: 'url',
      origin: 'video',
    };

    const renderer = rendererRegistry.get(videoRecommendation);
    
    expect(renderer).toBe(mockRenderer);
  });
});

