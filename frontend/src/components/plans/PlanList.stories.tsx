import type { Meta, StoryObj } from '@storybook/react';
import type { StudyPlan } from '@learners-high/shared';
import { PlanList } from './PlanList';

const plans: StudyPlan[] = [
  {
    id: 'p1',
    userId: 'u1',
    title: 'Mathematics · Chapter 4: Calculus',
    plannedDate: '2024-05-24',
    sortOrder: 0,
    durationMinutes: 90,
    completed: true,
  },
  {
    id: 'p2',
    userId: 'u1',
    title: 'English · Essay Writing Practice',
    plannedDate: '2024-05-24',
    sortOrder: 1,
    durationMinutes: 45,
    completed: false,
  },
];

const meta: Meta<typeof PlanList> = {
  title: 'Plans/PlanList',
  component: PlanList,
};

export default meta;
type Story = StoryObj<typeof PlanList>;

export const Default: Story = {
  args: { plans },
};

export const Empty: Story = {
  args: { plans: [] },
};
