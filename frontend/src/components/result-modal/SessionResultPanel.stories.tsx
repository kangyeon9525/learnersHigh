import type { Meta, StoryObj } from '@storybook/react';
import type { StudySessionResult } from '@learners-high/shared';
import { SessionResultPanel } from './SessionResultPanel';

const baseResult: StudySessionResult = {
  sessionId: 'demo-session',
  focusMinutes: 45,
  earnedScore: 190,
  newMilestones: [],
  completedGoals: [],
  growthDelta: {
    lifetime: { fromStage: 1, toStage: 1 },
    monthly: { fromStage: 0, toStage: 1 },
  },
};

const meta: Meta<typeof SessionResultPanel> = {
  title: 'ResultModal/SessionResultPanel',
  component: SessionResultPanel,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof SessionResultPanel>;

export const Empty: Story = {
  args: { result: baseResult },
};

export const MilestonesOnly: Story = {
  args: {
    result: {
      ...baseResult,
      newMilestones: [
        {
          id: 'm1',
          userId: 'u1',
          title: '순공 30분 달성',
          conditionCode: 'FOCUS_30_MIN',
          rewardScore: 100,
          isAchieved: true,
          achievedAt: '2026-06-01T12:00:00.000Z',
        },
      ],
    },
  },
};

export const QuestsOnly: Story = {
  args: {
    result: {
      ...baseResult,
      completedGoals: [
        {
          id: 'g1',
          userId: 'u1',
          cycle: 'daily',
          targetValue: 60,
          currentValue: 60,
          rewardScore: 80,
          isCompleted: true,
        },
      ],
    },
  },
};

export const Combined: Story = {
  args: {
    result: {
      ...baseResult,
      earnedScore: 370,
      newMilestones: [
        {
          id: 'm1',
          userId: 'u1',
          title: '첫 학습 완료',
          conditionCode: 'FIRST_SESSION',
          rewardScore: 50,
          isAchieved: true,
        },
      ],
      completedGoals: [
        {
          id: 'g1',
          userId: 'u1',
          cycle: 'weekly',
          targetValue: 300,
          currentValue: 300,
          rewardScore: 150,
          isCompleted: true,
        },
      ],
      growthDelta: {
        lifetime: { fromStage: 1, toStage: 2 },
        monthly: { fromStage: 1, toStage: 2 },
      },
    },
  },
};
