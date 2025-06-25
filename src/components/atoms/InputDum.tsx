import React from 'react';

interface InputProps {
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputDum: React.FC<InputProps> = ({ type, placeholder, onChange, required = false }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    required={required}
    className='flex-1 bg-transparent outline-none text-gray-500 text-base font-normal leading-normal'
  />
);

export default InputDum;
