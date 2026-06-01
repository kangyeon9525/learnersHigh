import type { Meta, StoryObj } from '@storybook/react';
import { PageState } from './PageState';

const meta: Meta<typeof PageState> = {
  title: 'UI/PageState',
  component: PageState,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof PageState>;

export const Loading: Story = {
  args: { variant: 'loading' },
};

export const Error: Story = {
  args: {
    variant: 'error',
    actionLabel: '다시 시도',
    onAction: () => undefined,
  },
};

export const Empty: Story = {
  args: {
    variant: 'empty',
    title: '오늘 계획이 없어요',
    message: '학습 계획을 추가해 보세요.',
  },
};
