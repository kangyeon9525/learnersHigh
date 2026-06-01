import type { Meta, StoryObj } from '@storybook/react';
import { AchievementGrid } from './AchievementGrid';

const milestones = [
  {
    id: 'm1',
    userId: 'u1',
    title: '첫 학습 완료',
    conditionCode: 'FIRST_SESSION',
    rewardScore: 50,
    isAchieved: true,
    achievedAt: '2026-05-01',
  },
  {
    id: 'm2',
    userId: 'u1',
    title: '순공 60분',
    conditionCode: 'FOCUS_60_MIN',
    rewardScore: 200,
    isAchieved: false,
  },
];

const goals = [
  {
    id: 'g1',
    userId: 'u1',
    cycle: 'daily' as const,
    targetValue: 60,
    currentValue: 45,
    rewardScore: 80,
    isCompleted: false,
  },
  {
    id: 'g2',
    userId: 'u1',
    cycle: 'weekly' as const,
    targetValue: 300,
    currentValue: 300,
    rewardScore: 150,
    isCompleted: true,
  },
];

const meta: Meta<typeof AchievementGrid> = {
  title: 'Mypage/AchievementGrid',
  component: AchievementGrid,
};

export default meta;
type Story = StoryObj<typeof AchievementGrid>;

export const Default: Story = {
  args: { milestones, goals },
};

export const Empty: Story = {
  args: { milestones: [], goals: [] },
};

export const AllAchieved: Story = {
  args: {
    milestones: milestones.map((m) => ({ ...m, isAchieved: true })),
    goals: goals.map((g) => ({ ...g, isCompleted: true, currentValue: g.targetValue })),
  },
};
