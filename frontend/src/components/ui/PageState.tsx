import type { ReactNode } from 'react';
import { Button } from './Button';
import './PageState.css';

export type PageStateVariant = 'loading' | 'error' | 'empty';

interface Props {
  variant: PageStateVariant;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  testId?: string;
}

const DEFAULTS: Record<PageStateVariant, { title: string; message: string }> = {
  loading: { title: '불러오는 중', message: '잠시만 기다려 주세요…' },
  error: { title: '불러오지 못했습니다', message: '네트워크 또는 서버 연결을 확인해 주세요.' },
  empty: { title: '표시할 내용이 없습니다', message: '새 항목을 추가하거나 다른 메뉴를 이용해 보세요.' },
};

/** P1.2.4 — 로딩·에러·빈 상태 공통 레이아웃 (fixture/API 전환용) */
export function PageState({
  variant,
  title,
  message,
  actionLabel,
  onAction,
  children,
  testId = 'page-state',
}: Props) {
  const defaults = DEFAULTS[variant];

  return (
    <div
      className={`page-state page-state--${variant}`}
      data-testid={testId}
      data-variant={variant}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {variant === 'loading' && <span className="page-state__spinner" aria-hidden />}
      <h3 className="page-state__title">{title ?? defaults.title}</h3>
      <p className="page-state__message">{message ?? defaults.message}</p>
      {children}
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction} data-testid={`${testId}-action`}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
