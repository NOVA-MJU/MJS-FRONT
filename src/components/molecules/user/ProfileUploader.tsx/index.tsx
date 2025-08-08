import React, { useState } from 'react';
import ImageInput from '../../../atoms/Input/ImageInput';
import { MAX_FILE_SIZE_MB } from '../../../../constants/maxFileSize';

interface Props {
  onChange: (file: File) => void;
  label?: string;
  defaultImg?: string | null;
}

const ProfileImageUploader: React.FC<Props> = ({
  onChange,
  label = '프로필',
  defaultImg = null,
}) => {
  const [preview, setPreview] = useState<string | null>(defaultImg);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`파일 크기는 최대 ${MAX_FILE_SIZE_MB}MB까지 업로드할 수 있습니다.`);
      return;
    }
    const objectURL = URL.createObjectURL(file);
    setPreview(objectURL);
    onChange(file);
  };

  return (
    <div className='w-full'>
      <div className='flex items-center gap-6'>
        <label className='text-blue-10 text-md md:text-xl font-semibold whitespace-nowrap'>
          {label}
        </label>
        <hr className='flex-1 border-t-2 border-blue-10 rounded-xl' />
      </div>
      <ImageInput imageUrl={preview} onImageChange={handleChange} />
    </div>
  );
};

export default ProfileImageUploader;
