import React from 'react';
import defaultAvatar from '@/assets/avatar-default.jpeg';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  className?: string;
}

export default function Avatar({ src, className, ...props }: AvatarProps) {
  /**
   * 이미지 로딩 실패 시 기본 아바타 이미지로 대체합니다.
   */
  const [imgSrc, setImgSrc] = React.useState(src ?? defaultAvatar);

  return (
    <img
      src={imgSrc}
      alt='프로필 이미지'
      className={twMerge(clsx('w-12 h-12 aspect-square rounded-full object-cover', className))}
      onError={() => setImgSrc(defaultAvatar)}
      {...props}
    />
  );
}
