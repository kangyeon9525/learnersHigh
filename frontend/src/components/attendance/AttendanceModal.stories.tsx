import type { Meta, StoryObj } from '@storybook/react';
import { AttendanceModal } from './AttendanceModal';

const meta: Meta<typeof AttendanceModal> = {
  title: 'Attendance/AttendanceModal',
  component: AttendanceModal,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    onClose: () => undefined,
    onCheckIn: () => undefined,
    onCheckOut: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof AttendanceModal>;

export const CheckIn: Story = {
  args: { mode: 'check-in' },
};

export const CheckOut: Story = {
  args: { mode: 'check-out' },
};
