import React from 'react';

export interface BadgeProps {
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ text }) => (
  <span className='w-[66px] px-3 py-2 text-xs font-medium text-white bg-mju-primary rounded-full'>
    {text}
  </span>
);

export default Badge;
