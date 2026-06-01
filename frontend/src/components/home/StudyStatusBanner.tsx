import type { StudyPresence } from '../../utils/studyPresence';
import { studyPresenceLabel } from '../../utils/studyPresence';
import './StudyStatusBanner.css';

interface Props {
  presence: StudyPresence;
}

/** P1.3.2 — 미입실 / 입실 / 학습중 / 퇴실 상태 배너 */
export function StudyStatusBanner({ presence }: Props) {
  const { title, hint } = studyPresenceLabel(presence);

  return (
    <div
      className={`study-status study-status--${presence}`}
      data-testid="study-status-banner"
      data-presence={presence}
      role="status"
    >
      <span className="study-status__dot" aria-hidden />
      <div>
        <strong>{title}</strong>
        <p className="muted">{hint}</p>
      </div>
    </div>
  );
}
