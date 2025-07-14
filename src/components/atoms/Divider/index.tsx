import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  variant?: 'default' | 'thin';
};

export default function Divider({ variant = 'default', className, ...props }: DividerProps) {
  return (
    <hr
      {...props}
      className={clsx(
        'w-full rounded-full border-0',
        {
          'h-[4px] bg-gradient-to-r from-blue-05 to-white': variant === 'default',
          'h-[2px] bg-grey-05': variant === 'thin',
        },
        className,
      )}
    />
  );
}
