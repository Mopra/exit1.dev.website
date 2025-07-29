import type { ReactNode } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  children?: ReactNode;
}

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  children 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex items-center space-x-2">
        <svg
          className={`animate-spin ${sizeClasses[size]} text-gray-400`}
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && (
          <span className="text-sm text-gray-600 sr-only">
            {text}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

export default LoadingSpinner; 