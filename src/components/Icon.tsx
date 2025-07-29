import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { ReactNode } from 'react';

interface IconProps {
  icon: IconDefinition;
  className?: string;
  size?: 'xs' | 'sm' | 'lg' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
  title?: string;
  children?: ReactNode;
}

const Icon = ({ 
  icon, 
  className = '', 
  size = '1x', 
  title,
  children 
}: IconProps) => {
  return (
    <span 
      className={`inline-flex items-center ${className}`}
      title={title}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      <FontAwesomeIcon 
        icon={icon} 
        size={size}
        className="flex-shrink-0"
      />
      {children && <span className="ml-2">{children}</span>}
    </span>
  );
};

export default Icon; 