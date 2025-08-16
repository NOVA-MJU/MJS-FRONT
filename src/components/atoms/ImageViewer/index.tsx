import React from 'react';
import { colors } from '../../../styles/color';
import defaultAvatar from '../../../assets/avatar-default.jpeg';

/**
 * 기본 프로필 아이콘 경로를 입력하세요
 */
const DEFAULT_IMAGE_URL = defaultAvatar;

interface ImageViewerProps {
  imageUrl: string | undefined;
  className?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, className }) => {
  return (
    <div
      style={{ borderColor: colors.grey10 }}
      className={`rounded-xl overflow-hidden ${className}`}
    >
      <img src={imageUrl || DEFAULT_IMAGE_URL} alt='img' className='w-full h-full object-cover' />
    </div>
  );
};

export default ImageViewer;
