import React from 'react';
import Input from '../../../atoms/Input/Input';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
  showHr?: boolean;
  disabled?: boolean;
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
  disabled = false,
}) => {
  return (
    <div className='flex flex-col gap-2 w-full mx-auto'>
      <div className='flex items-center gap-4 md:gap-6'>
        <label
          className={`text-md md:text-xl whitespace-nowrap ${
            disabled ? 'text-grey-40 font-med' : 'text-blue-10 font-semibold'
          }`}
        >
          {label}
        </label>
        {showHr && (
          <hr
            className={`w-full border-t-2 rounded-xl ${
              disabled ? 'border-grey-40' : 'border-blue-10'
            }`}
          />
        )}
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
          disabled={disabled}
        />
        {rightElement && <div className='mt-2 md:ml-4'>{rightElement}</div>}
      </div>
    </div>
  );
};

export default InputField;
