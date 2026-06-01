import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: '오늘의 계획',
    subtitle: '3개 중 1개 완료',
    children: <p className="muted">집중 학습 60분 · 수학 문제 풀이</p>,
  },
};

export const Empty: Story = {
  args: {
    title: '오늘의 계획',
    children: <p className="muted">등록된 계획이 없습니다.</p>,
  },
};
