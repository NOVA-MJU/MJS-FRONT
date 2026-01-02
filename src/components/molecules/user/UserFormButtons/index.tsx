import React from 'react';
import Button from '../../../atoms/Button/Button';

interface LoginButtonsProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onSignUp?: () => void;
}

const UserFormButtons = ({
  label = '',
  loading = false,
  disabled = false,
  onSignUp,
}: LoginButtonsProps) => {
  const isLoginDisabled = disabled || loading;
  const loginVariant = isLoginDisabled ? 'grey' : 'main';
  return (
    <div className='flex flex-col gap-3 w-full'>
      <Button
        type='submit'
        variant={loginVariant}
        size='md'
        shape='rounded'
        disabled={isLoginDisabled}
        fullWidth
        className='md:hidden block'
      >
        {label}
      </Button>
      <Button
        type='submit'
        variant={loginVariant}
        size='lg'
        shape='rounded'
        disabled={isLoginDisabled}
        fullWidth
        className='hidden md:block'
      >
        {label}
      </Button>

      {/* 2) 회원가입 버튼 */}
      <Button
        type='button'
        variant='blue20'
        size='md'
        shape='rounded'
        disabled={false}
        fullWidth
        onClick={onSignUp}
        className='md:hidden block'
      >
        회원가입
      </Button>
      <Button
        type='button'
        variant='blue20'
        size='lg'
        shape='rounded'
        disabled={false}
        fullWidth
        onClick={onSignUp}
        className='hidden md:block'
      >
        회원가입
      </Button>
    </div>
  );
};

export default UserFormButtons;
