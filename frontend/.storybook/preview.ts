import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    viewport: {
      viewports: {
        tabletLandscape: {
          name: 'Tablet Landscape',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'tabletLandscape',
    },
    backgrounds: {
      default: 'app',
      values: [{ name: 'app', value: '#fafaf8' }],
    },
  },
};

export default preview;
