import { useState } from 'react';
import type { CheckOutPurpose } from '@learners-high/shared';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import './AttendanceModal.css';

export type AttendanceMode = 'check-in' | 'check-out';

interface Props {
  open: boolean;
  mode: AttendanceMode;
  onClose: () => void;
  onCheckIn?: () => void | Promise<void>;
  onCheckOut?: (purpose: CheckOutPurpose) => void | Promise<void>;
  confirmLoading?: boolean;
}

const PURPOSES: { value: CheckOutPurpose; label: string }[] = [
  { value: 'continue_study', label: '이어서 학습' },
  { value: 'break', label: '휴식' },
  { value: 'home', label: '귀가' },
  { value: 'other', label: '기타' },
];

/**
 * 입퇴실 모달 UI 셸 (P1.9).
 * 퇴실 시 목적 선택은 필수이며, 선택 전에는 확인 버튼이 비활성화된다.
 */
export function AttendanceModal({
  open,
  mode,
  onClose,
  onCheckIn,
  onCheckOut,
  confirmLoading = false,
}: Props) {
  const [purpose, setPurpose] = useState<CheckOutPurpose | null>(null);

  const isCheckIn = mode === 'check-in';
  const title = isCheckIn ? '입실 확인' : '퇴실 확인';

  const handleConfirm = async () => {
    if (isCheckIn) {
      await onCheckIn?.();
      return;
    }
    if (!purpose) return;
    await onCheckOut?.(purpose);
    setPurpose(null);
    onClose();
  };

  return (
    <Modal open={open} title={title} onClose={onClose} testId="attendance-modal">
      {isCheckIn ? (
        <p className="attendance-modal__desc">
          입실하면 집중 모니터링(웹캠 화면)이 켜집니다. 실제 영상은 녹화·저장되지 않습니다.
        </p>
      ) : (
        <fieldset className="attendance-modal__purposes" data-testid="checkout-purposes">
          <legend className="attendance-modal__desc">퇴실 목적을 선택하세요 (필수)</legend>
          {PURPOSES.map((item) => (
            <label key={item.value} className="attendance-modal__purpose">
              <input
                type="radio"
                name="checkout-purpose"
                value={item.value}
                checked={purpose === item.value}
                onChange={() => setPurpose(item.value)}
                data-testid={`purpose-${item.value}`}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="attendance-modal__actions">
        <Button variant="ghost" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={(!isCheckIn && !purpose) || confirmLoading}
          loading={confirmLoading}
          data-testid="attendance-confirm"
        >
          {isCheckIn ? '입실하기' : '퇴실하기'}
        </Button>
      </div>
    </Modal>
  );
}
