import React from 'react';
import Label from '../atoms/Label';
import Divider from '../atoms/Divider';
import Input from '../atoms/InputDum';

interface InputFieldProps {
  label: string;
  type: 'email' | 'password';
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, onChange }) => {
  return (
    <div>
      <div className='flex items-center gap-6'>
        <Label text={label} />
        <Divider width='w-[306px]' />
      </div>
      <div className='justify-start items-center w-[400px] mt-3 p-3 bg-white rounded-xl outline-2 outline-offset-[-2px] outline-gray-300 inline-flex'>
        <Input type={type} placeholder={placeholder} onChange={onChange} required />
      </div>
    </div>
  );
};

export default InputField;
