# Taboola Recommendation Widget

A lightweight, framework-agnostic recommendation widget built in TypeScript. It fetches recommendations from the Taboola API, normalizes the response, and renders different recommendation types using a pluggable renderer architecture.

## Screenshot

![Taboola Widget Demo](images/Taboola_widget_screenshot.GIF)

## Requirements

- Node.js (v14 or higher)
- npm or 
- USA VPN (required for Taboola API responses)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Lyubansky/Taboola-recommendation-widget.git
cd Taboola-recommendation-widget
```

2. Install dependencies:
```bash
npm install
```

## Build

Build the TypeScript code:
```bash
npm run build
```


## How to Run

### Development Setup

This project is a client-side TypeScript widget that runs in the browser and does not require a backend server.

1. **Install dependencies**
```bash
npm install
```

2. **Start TypeScript in watch mode**

This compiles TypeScript to JavaScript and automatically rebuilds on file changes:

```bash
npm run watch
```

3. **Serve the project in the browser**

**Recommended: VS Code Live Server**

- Install the Live Server extension in VS Code
- Right-click `index.html`
- Select "Open with Live Server"

The widget will load in the browser and automatically update when files change.

**Only one terminal is required. Live Server runs inside VS Code.**



## How the Widget Works

1. **Initialization**: The widget reads configuration from data attributes or uses defaults from `config.ts`
2. **API Fetching**: Fetches recommendations from the Taboola API using the configured parameters
3. **Response Normalization**: Transforms the API response into a standardized `Recommendation` format
4. **Renderer Selection**: Uses the renderer registry to find the appropriate renderer based on the recommendation's `origin` type
5. **Rendering**: Each renderer creates DOM elements and handles click behavior (e.g., sponsored opens in new tab, organic in same tab)
6. **Event Handling**: Uses event delegation for efficient click handling on dynamically rendered items

## Testing

Run unit tests in a new terminal:
```bash
npm test
```

Run tests in watch mode (auto-rerun on file changes):
```bash
npm run test:watch
```

### Test Coverage

The test suite covers:
- API URL building and response normalization
- Renderer registry and selection
- Click behavior (sponsored vs organic)
- Widget error handling (empty arrays, API errors)
- Widget rendering (correct number of items)
- Graceful handling of missing renderers

### Debug Mode

The widget includes a debug flag for development. To enable debug logging:

1. Open `src/config.ts`
2. Set `DEBUG = true`:
```typescript
export const DEBUG = true;
```

When enabled, debug logs will appear in the browser's DevTools console, showing:
- API URLs being called
- Raw API responses
- Configuration values
- Warnings for unrenderable items

**Note**: Debug logs are automatically suppressed in tests unless `DEBUG = true` in `config.ts`.

## Adding a New Renderer

To add support for a new recommendation type (e.g., `video`):

### 1. Create the Renderer

Create a new file `src/renderers/video.ts`:

```typescript
import { BaseRenderer } from './base.js';
import { Recommendation } from '../types.js';

export class VideoRenderer extends BaseRenderer {
  render(recommendation: Recommendation): HTMLElement {
    const container = this.createContainer(recommendation);
    
    // Add video-specific rendering logic
    // (e.g., video thumbnail, play button, etc.)
    
    return container;
  }
  
  handleClick(recommendation: Recommendation): void {
    // Define click behavior for video recommendations
    // (e.g., open video player, navigate to video page, etc.)
    window.location.href = recommendation.url;
  }
}
```

### 2. Register the Renderer

Add it to `src/renderers/registry.ts`:

```typescript
import { VideoRenderer } from './video.js';

// In the RendererRegistry constructor:
this.register('video', new VideoRenderer());
```

### 3. Ensure API Returns Matching Origin

Make sure the API response includes `origin: 'video'` for video recommendations. The widget will automatically use the `VideoRenderer` for items with that origin.

No changes needed to the widget code - the renderer registry handles everything automatically.

If a renderer is not registered for a given origin, the widget will skip that item and log a warning when DEBUG is enabled.

## Adding More APIs and Widget Extensibility

The widget supports multiple recommendation sources without changing core logic. Each API is implemented as its own module that normalizes responses to the widget's internal format.

### How to Add a New API

1. **Create a new API module** in `src/api/` (e.g., `organic.ts`):
   ```typescript
   export async function fetchOrganicRecommendations(
     config: WidgetConfig
   ): Promise<Recommendation[]> {
     // Build API URL
     // Fetch data
     // Normalize response to Recommendation[] format
     // Return recommendations
   }
   ```

2. **Define default configuration** in `config.ts`:
   ```typescript
   export const organicDefaultConfig: WidgetConfig = {
     publisherId: 'organic-publisher',
     apiKey: 'organic-key',
     // ... other defaults
   };
   ```

3. **Use the new API in your widget**:
   ```typescript
   import { fetchOrganicRecommendations } from './api/organic.js';
   import { organicDefaultConfig } from './config.js';
   
   const config = { ...organicDefaultConfig, ...customConfig };
   new TaboolaWidget(container, config, fetchOrganicRecommendations);
   ```

### Multiple Widgets on One Page

You can have multiple widgets, each using a different API:

```typescript
// Widget 1: Sponsored content
new TaboolaWidget(container1, sponsoredConfig, fetchRecommendations);

// Widget 2: Organic content  
new TaboolaWidget(container2, organicConfig, fetchOrganicRecommendations);
```

Each widget operates independently with its own configuration and data source. The widget doesn't know which API is being used—it only needs a function that returns `Promise<Recommendation[]>`.

### Key Points

- **Widget is API-agnostic**: It doesn't care which API you use, only that it receives `Recommendation[]`
- **Renderer registry handles rendering**: New recommendation types just need a renderer registered
- **Configuration is centralized**: Defaults in `config.ts`, overridden per widget instance
- **Safe failure**: Unknown recommendation types are skipped without breaking the widget


