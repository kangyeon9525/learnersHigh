import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { demoCoaches } from '../../fixtures/demo-data';
import './CoachingModal.css';

type Coach = typeof demoCoaches[number];

interface CoachingModalProps {
  open: boolean;
  onClose: () => void;
}

function QrMock({ value }: { value: string }) {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    const isFinder =
      (row < 2 && col < 2) || (row < 2 && col >= 5) || (row >= 5 && col < 2);
    const seed = ((row * 7 + col) * 31 + value.charCodeAt(0)) % 3;
    return isFinder || seed !== 0;
  });

  return (
    <div className="coaching-qr" aria-label="예약 QR 코드 (모의)" data-testid="coaching-qr">
      <div className="coaching-qr__grid">
        {cells.map((filled, i) => (
          <div key={i} className={`coaching-qr__cell${filled ? ' coaching-qr__cell--filled' : ''}`} />
        ))}
      </div>
      <p className="coaching-qr__label muted">QR 스캔 또는 아래 링크로 접속</p>
    </div>
  );
}

export function CoachingModal({ open, onClose }: CoachingModalProps) {
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  function handleClose() {
    setStep('select');
    setSelectedCoach(null);
    setSelectedSlot(null);
    onClose();
  }

  function handleBook() {
    if (selectedCoach && selectedSlot) setStep('confirm');
  }

  const mockLink = selectedCoach
    ? `https://coaching.learners-high.app/${selectedCoach.id}?slot=${selectedSlot ?? ''}`
    : '';

  return (
    <Modal open={open} title="코칭 클래스 예약" onClose={handleClose} testId="coaching-modal">
      {step === 'select' ? (
        <div className="coaching-select" data-testid="coaching-select">
          <p className="coaching-select__desc muted">
            전문 코치와 1:1로 학습 방향을 점검하고, 맞춤 피드백을 받아보세요.
          </p>

          <div className="coaching-select__coaches" role="radiogroup" aria-label="코치 선택">
            {demoCoaches.map((coach) => (
              <label
                key={coach.id}
                className={`coaching-coach${selectedCoach?.id === coach.id ? ' coaching-coach--selected' : ''}`}
                data-testid={`coaching-coach-${coach.id}`}
              >
                <input
                  type="radio"
                  name="coach"
                  value={coach.id}
                  checked={selectedCoach?.id === coach.id}
                  onChange={() => { setSelectedCoach(coach); setSelectedSlot(null); }}
                  className="sr-only"
                />
                <div className="coaching-coach__info">
                  <strong className="coaching-coach__name">{coach.name}</strong>
                  <span className="coaching-coach__specialty muted">{coach.specialty}</span>
                  <p className="coaching-coach__bio">{coach.bio}</p>
                </div>
              </label>
            ))}
          </div>

          {selectedCoach && (
            <div className="coaching-slots" data-testid="coaching-slots">
              <p className="coaching-slots__label">예약 가능 일정</p>
              <div className="coaching-slots__grid">
                {selectedCoach.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`coaching-slot${selectedSlot === slot ? ' coaching-slot--active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                    data-testid={`coaching-slot-${slot.replace(/[ :]/g, '-')}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="coaching-select__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleClose}
            >
              취소
            </button>
            <button
              type="button"
              className="btn btn--primary"
              disabled={!selectedCoach || !selectedSlot}
              onClick={handleBook}
              data-testid="coaching-book-btn"
            >
              예약하기
            </button>
          </div>
        </div>
      ) : (
        <div className="coaching-confirm" data-testid="coaching-confirm">
          <div className="coaching-confirm__info">
            <p>
              <strong>{selectedCoach?.name}</strong> ·{' '}
              <span className="muted">{selectedCoach?.specialty}</span>
            </p>
            <p className="coaching-confirm__slot">{selectedSlot}</p>
          </div>

          <QrMock value={mockLink} />

          <div className="coaching-confirm__link-wrap">
            <a
              href={mockLink}
              className="coaching-confirm__link"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="coaching-direct-link"
              onClick={(e) => e.preventDefault()}
            >
              다이렉트 접속 링크 열기 (모의)
            </a>
          </div>

          <p className="coaching-confirm__notice muted">
            실제 예약은 코치와의 개별 확인 후 확정됩니다.
          </p>

          <div className="coaching-confirm__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setStep('select')}>
              다시 선택
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleClose}
              data-testid="coaching-done-btn"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
