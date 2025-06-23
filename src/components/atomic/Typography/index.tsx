import React, { type JSX } from 'react';
import clsx from 'clsx';

export type TypographyVariant =
  | 'heading01'
  | 'heading02'
  | 'title01'
  | 'title02'
  | 'body01'
  | 'body02'
  | 'body03'
  | 'caption01'
  | 'caption02';

interface TypographyProps {
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
}

const variantConfig: Record<
  TypographyVariant,
  { tag: keyof JSX.IntrinsicElements; className: string }
> = {
  heading01: { tag: 'h1', className: 'font-bold text-[40px] leading-[150%]' },
  heading02: { tag: 'h2', className: 'font-bold text-[24px] leading-[150%]' },
  title01: { tag: 'h3', className: 'font-bold text-[20px] leading-[150%]' },
  title02: { tag: 'h4', className: 'font-semibold text-[20px] leading-[150%]' },
  body01: { tag: 'p', className: 'font-normal text-[20px] leading-[150%]' },
  body02: { tag: 'p', className: 'font-semibold text-[16px] leading-[150%]' },
  body03: { tag: 'p', className: 'font-normal text-[16px] leading-[150%]' },
  caption01: { tag: 'span', className: 'font-semibold text-[12px] leading-[150%]' },
  caption02: { tag: 'span', className: 'font-normal text-[12px] leading-[150%]' },
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body01',
  className,
  children,
}) => {
  const { tag: Tag, className: vClass } = variantConfig[variant];
  return <Tag className={clsx('font-pretendard', vClass, className)}>{children}</Tag>;
};
