import React from 'react';
import Input from '../../../atoms/input/Input';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
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
  autoComplete,
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
          autoComplete={autoComplete}
        />
        {rightElement && <div className='ml-4'>{rightElement}</div>}
      </div>
    </div>
  );
};

export default InputField;
