import React from 'react';
import Input from '../../../atoms/input/Input';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  error = false,
  helperText,
}) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex items-center gap-6'>
        <label className='text-blue-10 text-xl font-semibold whitespace-nowrap'>{label}</label>
        <hr className='flex-1 border-t-2 border-blue-10 rounded-xl' />
      </div>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant='outlined'
        error={error}
        helperText={helperText}
      />
    </div>
  );
};

export default InputField;
