import { buildTaboolaUrl, normalizeTaboolaResponse } from '../../src/api/taboola.js';
import { WidgetConfig, ApiResponse } from '../../src/types.js';

describe('buildTaboolaUrl', () => {
  const baseConfig: WidgetConfig = {
    source: 'taboola',
    publisherId: 'test-publisher',
    appType: 'desktop',
    apiKey: 'test-api-key',
    sourceId: 'test-source-id',
  };

  it('should build URL with required parameters', () => {
    const url = buildTaboolaUrl(baseConfig);
    
    expect(url).toContain('test-publisher');
    expect(url).toContain('app.type=desktop');
    expect(url).toContain('app.apikey=test-api-key');
    expect(url).toContain('source.id=test-source-id');
    expect(url).toContain('count=4'); // default
  });

  it('should include optional sourceType parameter', () => {
    const config = { ...baseConfig, sourceType: 'video' };
    const url = buildTaboolaUrl(config);
    
    expect(url).toContain('source.type=video');
  });

  it('should include optional sourceUrl parameter', () => {
    const config = { ...baseConfig, sourceUrl: 'http://example.com' };
    const url = buildTaboolaUrl(config);
    
    expect(url).toContain('source.url=http://example.com');
  });

  it('should use custom count parameter', () => {
    const config = { ...baseConfig, count: 8 };
    const url = buildTaboolaUrl(config);
    
    expect(url).toContain('count=8');
  });

  it('should build URL in correct format', () => {
    const config = {
      ...baseConfig,
      sourceType: 'video',
      sourceUrl: 'http://example.com',
      count: 4,
    };
    const url = buildTaboolaUrl(config);
    
    expect(url).toBe(
      'http://api.taboola.com/1.0/json/test-publisher/recommendations.get?app.type=desktop&app.apikey=test-api-key&count=4&source.type=video&source.id=test-source-id&source.url=http://example.com'
    );
  });
});
// Given a raw Taboola API response, does normalizeApiResponse return the data in widget’s internal format?
// Without normalization Renderers depend on Taboola field names and breaks if api changes
describe('normalizeTaboolaResponse', () => {
  it('should normalize valid API response', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: 'rec-1',
          name: 'Test Article',
          description: 'Test description',
          thumbnail: [{ url: 'http://example.com/image.jpg' }],
          url: 'http://example.com/article',
          origin: 'sponsored',
          branding: 'Test Brand',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'rec-1',
      title: 'Test Article',
      description: 'Test description',
      imageUrl: 'http://example.com/image.jpg',
      url: 'http://example.com/article',
      origin: 'sponsored',
      branding: 'Test Brand',
    });
  });

  it('should map name to title', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: 'rec-1',
          name: 'Article Title',
          description: 'Desc',
          thumbnail: [{ url: 'img.jpg' }],
          url: 'url',
          origin: 'sponsored',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result[0].title).toBe('Article Title');
  });

  it('should extract first thumbnail URL', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: 'rec-1',
          name: 'Title',
          description: 'Desc',
          thumbnail: [
            { url: 'first.jpg' },
            { url: 'second.jpg' },
          ],
          url: 'url',
          origin: 'sponsored',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result[0].imageUrl).toBe('first.jpg');
  });

  it('should handle missing thumbnail', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: 'rec-1',
          name: 'Title',
          description: 'Desc',
          thumbnail: [],
          url: 'url',
          origin: 'sponsored',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result[0].imageUrl).toBe('');
  });

  it('should add branding only for sponsored items', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: 'rec-1',
          name: 'Title',
          description: 'Desc',
          thumbnail: [{ url: 'img.jpg' }],
          url: 'url',
          origin: 'sponsored',
          branding: 'Brand Name',
        },
        {
          id: 'rec-2',
          name: 'Title 2',
          description: 'Desc 2',
          thumbnail: [{ url: 'img2.jpg' }],
          url: 'url2',
          origin: 'organic',
          branding: 'Should Not Appear',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result[0].branding).toBe('Brand Name');
    expect(result[1].branding).toBeUndefined();
  });

// normalizeApiResponse does not crash and always returns a safe, predictable shape even when the API sends missing or empty values.
// and does not crash when the API sends missing or empty values.
  it('should handle missing fields with empty strings', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: '',
          name: '',
          description: '',
          thumbnail: [],
          url: '',
          origin: 'sponsored',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result[0].id).toBe('');
    expect(result[0].title).toBe('');
    expect(result[0].description).toBe('');
    expect(result[0].imageUrl).toBe('');
    expect(result[0].url).toBe('');
  });

  it('should return empty array for invalid response.list', () => {
    const apiResponse = {
      id: 'response-id',
      list: null,
    } as unknown as ApiResponse;

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result).toEqual([]);
  });

  it('should return empty array for non-array list', () => {
    const apiResponse = {
      id: 'response-id',
      list: 'not-an-array',
    } as unknown as ApiResponse;

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result).toEqual([]);
  });

  it('should preserve origin as string', () => {
    const apiResponse: ApiResponse = {
      id: 'response-id',
      list: [
        {
          id: 'rec-1',
          name: 'Title',
          description: 'Desc',
          thumbnail: [{ url: 'img.jpg' }],
          url: 'url',
          origin: 'video',
        },
      ],
    };

    const result = normalizeTaboolaResponse(apiResponse);

    expect(result[0].origin).toBe('video');
  });
});

