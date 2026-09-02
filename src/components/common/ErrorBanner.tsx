import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, X } from 'lucide-react';

interface ErrorBannerProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  isNetworkError?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss,
  isNetworkError = false,
}) => {
  if (!error) return null;

  return (
    <div
      id="app-error-banner"
      role="alert"
      className="w-full bg-red-950/90 border-y sm:border sm:rounded-xl border-red-700/60 p-3 sm:p-4 text-red-100 backdrop-blur-md shadow-lg my-2"
    >
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="rounded-lg bg-red-900/60 p-2 shrink-0 border border-red-500/40 text-red-300">
            {isNetworkError ? (
              <WifiOff className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">
              {isNetworkError ? 'Network Connection Issue' : 'System Notice'}
            </h4>
            <p className="text-sm text-red-200 mt-0.5">{error}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              id="error-retry-btn"
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
          {onDismiss && (
            <button
              id="error-dismiss-btn"
              onClick={onDismiss}
              className="rounded-lg p-1 text-red-400 hover:text-white hover:bg-red-900/50 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
