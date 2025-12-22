# Renderers

The renderer system allows adding new recommendation types without modifying the widget code.

## Adding a New Renderer Type

### Step 1: Create the Renderer Class

Create a new file (e.g., `video.ts`) that implements the `Renderer` interface or extends `BaseRenderer`:

```typescript
import { Recommendation } from '../types.js';
import { BaseRenderer } from './base.js';

export class VideoRenderer extends BaseRenderer {
  render(recommendation: Recommendation): HTMLElement {
    const container = this.createContainer(recommendation);
    // Add your rendering logic here
    return container;
  }

  handleClick(recommendation: Recommendation): void {
    // Define click behavior (e.g., open video player)
    window.open(recommendation.url, '_blank');
  }
}
```

### Step 2: Register the Renderer

In `registry.ts`, import and register your new renderer:

```typescript
import { VideoRenderer } from './video.js';

// In the constructor:
this.register('video', new VideoRenderer());
```

That's it! The widget will automatically use your new renderer for recommendations with `origin: 'video'`.

## Architecture

- **Renderer Interface**: Defines `render()` and `handleClick()` methods
- **BaseRenderer**: Provides common functionality like `createContainer()`
- **RendererRegistry**: Maps origin types to renderer instances
- **Widget**: Uses registry to get appropriate renderer (no hardcoded types)

## Design Note

There's some duplication between renderers (e.g., image creation, error handling), but it's intentional. Sponsored and organic may diverge visually or behaviorally, so keeping renderers independent avoids premature abstraction. Common code can be extracted to `BaseRenderer` if duplication becomes excessive.

