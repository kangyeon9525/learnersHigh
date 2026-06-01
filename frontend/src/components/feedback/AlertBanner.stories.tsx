import type { Meta, StoryObj } from '@storybook/react';
import { AlertBanner } from './AlertBanner';

const meta: Meta<typeof AlertBanner> = {
  title: 'Feedback/AlertBanner',
  component: AlertBanner,
};

export default meta;
type Story = StoryObj<typeof AlertBanner>;

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: '집중력이 감지되지 않았습니다',
    description: '시선이 화면에서 벗어났습니다. 집중 시간은 적립되지 않습니다.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: '데모 데이터로 표시 중',
    description: '백엔드 연결 후 실시간 데이터가 제공됩니다.',
  },
};
