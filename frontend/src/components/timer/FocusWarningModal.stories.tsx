import type { Meta, StoryObj } from '@storybook/react';
import { FocusWarningModal } from './FocusWarningModal';

const meta: Meta<typeof FocusWarningModal> = {
  title: 'Timer/FocusWarningModal',
  component: FocusWarningModal,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    onResume: () => undefined,
    onStop: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof FocusWarningModal>;

export const Open: Story = {};

export const Closed: Story = {
  args: { open: false },
};
