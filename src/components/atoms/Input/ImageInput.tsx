import React from 'react';
import { colors } from '../../../styles/color';

interface ProfileImageInputProps {
  imageUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput = ({ imageUrl, onImageChange }: ProfileImageInputProps) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor='profile-image' className='cursor-pointer'>
        <div
          className='w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 mt-3'
          style={{ borderColor: colors.grey10 }}
        >
          {imageUrl && imageUrl !== '' ? (
            <img src={imageUrl} alt='프로필' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-xs md:text-sm text-grey-20'>
              이미지 업로드
            </div>
          )}
        </div>
      </label>
      <input
        id='profile-image'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onImageChange}
      />
    </div>
  );
};

export default ImageInput;
