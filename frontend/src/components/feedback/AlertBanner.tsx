import type { ReactNode } from 'react';
import './AlertBanner.css';

export type AlertBannerVariant = 'warning' | 'info' | 'success';

interface Props {
  variant?: AlertBannerVariant;
  title: string;
  description?: string;
  icon?: ReactNode;
  testId?: string;
}

/** P1.1.4 — 인라인 경고·알림 배너 (집중 이탈 등, 모달과 별도) */
export function AlertBanner({
  variant = 'warning',
  title,
  description,
  icon,
  testId = 'alert-banner',
}: Props) {
  return (
    <div
      className={`alert-banner alert-banner--${variant}`}
      role="status"
      aria-live="polite"
      data-testid={testId}
    >
      {icon ? <span className="alert-banner__icon">{icon}</span> : null}
      <div className="alert-banner__text">
        <strong>{title}</strong>
        {description ? <span>{description}</span> : null}
      </div>
    </div>
  );
}
