import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
    title: '퇴실 목적 선택',
    children: (
      <>
        <p>오늘 학습을 마무리합니다. 퇴실 목적을 선택해 주세요.</p>
        <Button variant="primary" style={{ marginTop: '1rem' }}>
          귀가
        </Button>
      </>
    ),
  },
};
