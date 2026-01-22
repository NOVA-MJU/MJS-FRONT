import React, { forwardRef } from 'react';
import Input from '../../../atoms/Input/Input';

interface InputFieldProps {
  label: string;
  name?: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
  showHr?: boolean;
  disabled?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      placeholder,
      type,
      autoComplete,
      value,
      defaultValue,
      onChange,
      error = false,
      helperText,
      showHr = true,
      rightElement,
      disabled = false,
    },
    ref,
  ) => {
    return (
      <div className='mx-auto flex w-full flex-col gap-2'>
        <div className='flex items-center gap-4 md:gap-6'>
          <label
            className={`text-md whitespace-nowrap md:text-xl ${
              disabled ? 'text-grey-40 font-med' : 'text-blue-10 font-semibold'
            }`}
          >
            {label}
          </label>
          {showHr && (
            <hr
              className={`w-full rounded-xl border-t-2 ${
                disabled ? 'border-grey-40' : 'border-blue-10'
              }`}
            />
          )}
        </div>
        <div className='flex'>
          <Input
            ref={ref}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
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
  },
);

export default InputField;
