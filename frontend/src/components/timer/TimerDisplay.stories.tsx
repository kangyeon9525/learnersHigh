import type { Meta, StoryObj } from '@storybook/react';
import { TimerDisplay } from './TimerDisplay';
import { TimerModeToggle } from './TimerModeToggle';

const meta: Meta<typeof TimerDisplay> = {
  title: 'Timer/TimerDisplay',
  component: TimerDisplay,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TimerDisplay>;

export const Idle: Story = {
  args: {
    seconds: 0,
    focusSeconds: 0,
    subjectLabel: '학습을 시작해 보세요',
  },
};

export const Running: Story = {
  args: {
    seconds: 3725,
    focusSeconds: 3200,
    subjectLabel: '집중 학습 중',
  },
};

export const WithModeToggle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      <TimerModeToggle mode="stopwatch" onChange={() => undefined} />
      <TimerDisplay seconds={125} focusSeconds={100} subjectLabel="집중 학습 중" />
    </div>
  ),
};
