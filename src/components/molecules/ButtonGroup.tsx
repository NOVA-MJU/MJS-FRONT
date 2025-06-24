import React from 'react';
import Button from '../atoms/BtnDum';

interface ButtonGroupProps {
  onSubmit?: () => void;
  onSignup?: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ onSubmit, onSignup }) => {
  return (
    <div className='flex flex-col gap-3 w-[440px]'>
      <Button type='submit' text='로그인' variant='primary' onClick={onSubmit} />
      <Button type='button' text='회원가입' variant='secondary' onClick={onSignup} />
    </div>
  );
};

export default ButtonGroup;
