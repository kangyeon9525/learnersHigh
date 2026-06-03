import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  /** 커스텀 fallback UI. 없으면 기본 에러 카드 사용. */
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * P5.1: 페이지 수준 React 에러 바운더리.
 * 렌더 오류를 잡아 앱 전체 크래시를 막고 "다시 시도" 복구 UI를 제공한다.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack?.slice(0, 300));
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary" data-testid="error-boundary" role="alert">
          <div className="error-boundary__icon" aria-hidden>⚠</div>
          <h3 className="error-boundary__title">페이지를 불러오는 중 오류가 발생했습니다</h3>
          <p className="error-boundary__message muted">{this.state.error.message}</p>
          <button
            type="button"
            className="btn btn--ghost error-boundary__retry"
            onClick={this.handleRetry}
            data-testid="error-boundary-retry"
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
