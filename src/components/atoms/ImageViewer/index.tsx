import React from 'react';
import { colors } from '../../../styles/color';

interface ImageViewerProps {
  imageUrl: string | undefined;
  width?: string;
  height?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  return (
    <div style={{ borderColor: colors.grey10 }} className='w-48 h-48 rounded-xl overflow-hidden'>
      <img src={imageUrl} alt='img' className='w-full h-full object-cover' />
    </div>
  );
};

export default ImageViewer;
