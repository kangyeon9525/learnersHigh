import type { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Card({
  title,
  subtitle,
  padding = 'md',
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`lh-card lh-card--${padding} ${className}`.trim()} {...rest}>
      {(title || subtitle) && (
        <header className="lh-card__header">
          {title ? <h3 className="lh-card__title">{title}</h3> : null}
          {subtitle ? <p className="lh-card__subtitle">{subtitle}</p> : null}
        </header>
      )}
      <div className="lh-card__body">{children}</div>
    </div>
  );
}
