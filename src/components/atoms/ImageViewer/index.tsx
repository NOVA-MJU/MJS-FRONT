import React from 'react';
import { colors } from '../../../styles/color';

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
      <img src={imageUrl} alt='img' className='w-full h-full object-cover' />
    </div>
  );
};

export default ImageViewer;
