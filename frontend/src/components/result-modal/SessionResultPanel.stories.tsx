import type { Meta, StoryObj } from '@storybook/react';
import { SessionResultPanel } from './SessionResultPanel';
import { demoSettlementVariants } from '../../fixtures/demo-data';

const meta: Meta<typeof SessionResultPanel> = {
  title: 'ResultModal/SessionResultPanel',
  component: SessionResultPanel,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof SessionResultPanel>;

/** P1.5.2 / P1.5.4 — fixture 4변형 */
export const Empty: Story = {
  args: { result: demoSettlementVariants.empty },
};

export const MilestonesOnly: Story = {
  args: {
    result: {
      ...demoSettlementVariants.milestonesOnly,
      newMilestones: [...demoSettlementVariants.milestonesOnly.newMilestones],
    },
  },
};

export const QuestsOnly: Story = {
  args: {
    result: {
      ...demoSettlementVariants.questsOnly,
      completedGoals: [...demoSettlementVariants.questsOnly.completedGoals],
    },
  },
};

export const Combined: Story = {
  args: {
    result: {
      ...demoSettlementVariants.combined,
      newMilestones: [...demoSettlementVariants.combined.newMilestones],
      completedGoals: [...demoSettlementVariants.combined.completedGoals],
    },
  },
};
