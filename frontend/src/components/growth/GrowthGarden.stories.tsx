import type { Meta, StoryObj } from '@storybook/react';
import type { GrowthState } from '@learners-high/shared';
import { GrowthGarden } from './GrowthGarden';

const mockGrowth: GrowthState = {
  id: 'g1',
  userId: 'u1',
  lifetime: { totalScore: 420, currentStage: 2, history: [] },
  monthly: {
    currentMonth: '2026-06',
    totalScore: 120,
    currentStage: 1,
    archive: [
      { month: '2026-05', totalScore: 220, finalStage: 2 },
      { month: '2026-04', totalScore: 150, finalStage: 1 },
    ],
  },
};

const meta: Meta<typeof GrowthGarden> = {
  title: 'Growth/GrowthGarden',
  component: GrowthGarden,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof GrowthGarden>;

export const Default: Story = {
  args: { growth: mockGrowth },
};

export const Seedling: Story = {
  args: {
    growth: {
      ...mockGrowth,
      lifetime: { ...mockGrowth.lifetime, currentStage: 0, totalScore: 30 },
      monthly: { ...mockGrowth.monthly, currentStage: 0, totalScore: 10 },
    },
  },
};

export const MatureTree: Story = {
  args: {
    growth: {
      ...mockGrowth,
      lifetime: { ...mockGrowth.lifetime, currentStage: 4, totalScore: 1200 },
      monthly: { ...mockGrowth.monthly, currentStage: 4, totalScore: 350 },
    },
  },
};
