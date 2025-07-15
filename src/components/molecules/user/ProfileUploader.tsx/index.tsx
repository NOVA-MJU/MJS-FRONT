import React, { useState } from 'react';
import ImageInput from '../../../atoms/input/ImageInput';

interface Props {
  onUpload: (file: File) => void;
  label?: string;
  error?: boolean;
}

const ProfileImageUploader: React.FC<Props> = ({ onUpload, label = '프로필' }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className='w-full'>
      {/* 라벨 + 밑줄 */}
      <div className='flex items-center gap-6'>
        <label className='text-blue-10 text-xl font-semibold whitespace-nowrap'>{label}</label>
        <hr className='flex-1 border-t-2 border-blue-10 rounded-xl' />
      </div>

      {/* 실제 입력 컴포넌트 */}
      <ImageInput imageUrl={preview} onImageChange={handleChange} />
    </div>
  );
};

export default ProfileImageUploader;
