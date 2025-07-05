import type { ReactNode } from 'react';

interface IconButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function IconButton({ onClick, children, className = '' }: IconButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`cursor-pointer w-6 h-6 flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
