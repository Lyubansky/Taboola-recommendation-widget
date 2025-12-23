# Recommendation Widget

A lightweight, framework-agnostic recommendation widget built in TypeScript. It fetches recommendations from configurable API sources, normalizes the response, and renders different recommendation types using a pluggable renderer architecture. The widget is API-agnostic and supports multiple recommendation sources without changing core logic.

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

1. **Initialization**: The widget is instantiated with a configuration object (defaults from `config.ts` or custom config). It sets up the container, attaches event listeners, and begins loading recommendations.

2. **API Routing**: The `config.source` field routes to the appropriate API via `api/index.ts` router. The router selects the correct API module (e.g., `taboola`, `organic`, `video`) based on this value.

3. **API Fetching**: The selected API module fetches recommendations from its endpoint and normalizes the response to a standardized `Recommendation[]` format. Each API module handles its own URL building and response transformation.

4. **Renderer Selection**: For each recommendation, the widget uses the renderer registry to find the appropriate renderer based on the recommendation's `origin` type (e.g., `sponsored`, `organic`). If no renderer is found, the recommendation is safely skipped.

5. **Rendering**: Each renderer creates DOM elements using a `DocumentFragment` for performance. The renderer defines both the visual structure and click behavior (e.g., sponsored opens in new tab, organic in same tab).

6. **Event Handling**: A single click listener on the widget container uses event delegation to handle clicks on dynamically rendered items. The widget finds the clicked recommendation and delegates to the appropriate renderer's `handleClick` method.

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
- Click behavior (sponsored opens new tab, organic opens same tab)
- Widget error handling (empty arrays, API errors, non-Error objects)
- Widget rendering (correct number of items, loading states)
- Widget initialization (container setup)
- Renderer DOM structure and branding elements
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

No changes are required in the widget. Renderer selection is handled automatically by the renderer registry based on the recommendation origin.

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

2. **Add the new source to the API router** in `src/api/index.ts`:
   ```typescript
   import { fetchOrganicRecommendations } from './organic.js';
   
   export async function fetchRecommendations(config: WidgetConfig) {
     switch (config.source) {
       case 'taboola':
         return fetchTaboolaRecommendations(config);
       case 'organic':
         return fetchOrganicRecommendations(config); // Add this
       default:
         throw new Error(`Unknown source: ${config.source}`);
     }
   }
   ```

3. **Define default configuration** in `config.ts`:
   ```typescript
   export const organicDefaultConfig: WidgetConfig = {
     source: 'organic', // Required: identifies which API to use
     publisherId: 'organic-publisher',
     apiKey: 'organic-key',
     // ... other defaults
   };
   ```

4. **Use the new API in your widget**:
   ```typescript
   import { Widget } from './widget.js';
   import { organicDefaultConfig } from './config.js';
   
   const config = { ...organicDefaultConfig, ...customConfig };
   new Widget(container, config);
   ```

### Multiple Widgets on One Page

You can have multiple widgets, each using a different API:

```typescript
import { Widget } from './widget.js';

// Widget 1: Taboola content
const taboolaConfig = { source: 'taboola', ...otherConfig };
new Widget(container1, taboolaConfig);

// Widget 2: Organic content  
const organicConfig = { source: 'organic', ...otherConfig };
new Widget(container2, organicConfig);
```

Each widget operates independently with its own configuration and data source. The widget doesn’t know which API is being used. The `config.source` field routes the request to the correct API via the router in `api/index.ts`
### Key Points

- **Widget is API-agnostic**: It doesn't know about Taboola, Organic, or any specific API. It only calls `fetchRecommendations(config)` from the API router
- **Config-driven routing**: The `config.source` field determines which API is used via the router in `api/index.ts`
- **Renderer registry handles rendering**: New recommendation types just need a renderer registered
- **Configuration is centralized**: Defaults in `config.ts`, overridden per widget instance
- **Safe failure**: Unknown recommendation types are skipped without breaking the widget
- **Widget never changes**: Adding new APIs only requires updating the router, not the widget implementation


