import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorMessageProps {
  message: string;
  severity?: ErrorSeverity;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * A component for displaying error messages with different severity levels
 * and the ability to retry or dismiss the error.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  severity = 'error',
  details,
  onRetry,
  onDismiss,
  className = '',
}) => {
  // Define styles based on severity
  const getSeverityStyles = (): { bg: string; border: string; text: string; icon: JSX.Element } => {
    switch (severity) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />,
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />,
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />,
        };
    }
  };

  const { bg, border, text, icon } = getSeverityStyles();

  return (
    <div className={`p-4 ${bg} border ${border} rounded-md ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${text}`}>{message}</h3>
          {details && (
            <details className="mt-2">
              <summary className={`text-sm ${text} cursor-pointer font-medium`}>
                Show details
              </summary>
              <pre className={`mt-2 text-xs ${text} whitespace-pre-wrap p-2 bg-white bg-opacity-50 rounded`}>
                {details}
              </pre>
            </details>
          )}
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                    severity === 'error'
                      ? 'text-white bg-red-600 hover:bg-red-700'
                      : severity === 'warning'
                      ? 'text-white bg-yellow-600 hover:bg-yellow-700'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    severity === 'error'
                      ? 'focus:ring-red-500'
                      : severity === 'warning'
                      ? 'focus:ring-yellow-500'
                      : 'focus:ring-blue-500'
                  }`}
                >
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${
                  severity === 'error'
                    ? 'text-red-500 hover:bg-red-100'
                    : severity === 'warning'
                    ? 'text-yellow-500 hover:bg-yellow-100'
                    : 'text-blue-500 hover:bg-blue-100'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  severity === 'error'
                    ? 'focus:ring-red-500'
                    : severity === 'warning'
                    ? 'focus:ring-yellow-500'
                    : 'focus:ring-blue-500'
                }`}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 