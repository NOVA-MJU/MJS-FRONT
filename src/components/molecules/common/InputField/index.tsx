import React from 'react';
import Input from '../../../atoms/Input/Input';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
  showHr?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  error = false,
  helperText,
  showHr = true,
  rightElement,
}) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex items-center gap-6'>
        <label className='text-blue-10 text-xl font-semibold whitespace-nowrap'>{label}</label>
        {showHr && <hr className='w-full flex-1 border-t-2 border-blue-10 rounded-xl' />}
      </div>
      <div className='flex'>
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          variant='outlined'
          error={error}
          helperText={helperText}
        />
        {rightElement && <div className='ml-4'>{rightElement}</div>}
      </div>
    </div>
  );
};

export default InputField;
