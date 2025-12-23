# Taboola Recommendation Widget

A client-side recommendation widget built with TypeScript that displays recommendations from the Taboola API.

## Features

- ✅ TypeScript implementation (no frameworks)
- ✅ Client-side only
- ✅ Responsive design (mobile & desktop)
- ✅ Extensible architecture (easy to add new recommendation types)
- ✅ Unit test support
- ✅ Browser compatibility

## Project Structure

```
/
├── src/
│   ├── index.ts          # Entry point
│   ├── types.ts          # Type definitions
│   ├── api/              # API modules
│   │   └── taboola.ts    # Taboola API client
│   ├── renderers/        # Renderer implementations
│   │   ├── base.ts       # Base renderer interface
│   │   ├── sponsored.ts  # Sponsored renderer
│   │   ├── organic.ts    # Organic renderer
│   │   └── registry.ts   # Renderer registry
│   └── widget.ts         # Main widget class
├── styles/
│   └── widget.css        # Widget styles
├── tests/
│   └── *.test.ts         # Unit tests
├── index.html            # Demo page
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Building

Build the TypeScript code:
```bash
npm run build
```

Watch mode (auto-rebuild on changes):
```bash
npm run watch
```

## Running with Live Server

### Quick Start

1. **Build the project first** (required - creates `dist/index.js`):
```bash
npm run build
```

2. **Start a live server** (choose one method):

   **Option A: VS Code Live Server Extension (Recommended)**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` → Select "Open with Live Server"
   - The page will automatically open in your browser
   - The page will auto-refresh when you make changes

   **Option B: Using http-server (Node.js)**
   ```bash
   npx http-server
   ```
   Then open `http://localhost:8080` in your browser

   **Option C: Using Python**
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

### Development Workflow (Recommended)

For the best development experience, use **watch mode** + **live server**:

1. **Terminal 1** - Start TypeScript watch mode (auto-rebuilds on file changes):
```bash
npm run watch
```

2. **Terminal 2** - Start your live server (use one of the options above)

Now when you edit TypeScript files:
- TypeScript automatically rebuilds → `dist/index.js` updates
- Live server automatically refreshes the browser

**Note:** The Taboola API requires a USA VPN to get responses.

## Usage

### Basic Usage

Add a container element to your HTML:
```html
<div id="taboola-widget"></div>
```

The widget will automatically initialize when the page loads.

### Custom Configuration

You can customize the widget using data attributes:
```html
<div 
  id="taboola-widget"
  data-publisher-id="taboola-templates"
  data-app-type="desktop"
  data-api-key="your-api-key"
  data-source-id="your-source-id"
  data-source-type="video"
  data-source-url="http://example.com/page.html"
  data-count="4">
</div>
```

## Testing

Run unit tests:
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

## Browser Support

The widget is designed to work on modern browsers with support for:
- ES2015 JavaScript features
- Fetch API (with fallback to XMLHttpRequest)
- CSS Flexbox

## Development

### Adding a New Recommendation Type

1. Create a new renderer in `src/renderers/`:
```typescript
import { BaseRenderer } from './base';
import { Recommendation } from '../types';

export class VideoRenderer extends BaseRenderer {
  render(recommendation: Recommendation): HTMLElement {
    // Implementation
  }
  
  handleClick(recommendation: Recommendation): void {
    // Implementation
  }
}
```

2. Register it in `src/renderers/registry.ts`:
```typescript
import { VideoRenderer } from './video';

// In constructor or initialization
this.register('video', new VideoRenderer());
```

3. Update the `Recommendation` type in `src/types.ts` if needed.

## License

ISC

