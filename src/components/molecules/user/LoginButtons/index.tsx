import React from 'react';
import Button from '../../../atoms/Button/Button';

interface LoginButtonsProps {
  loading?: boolean;
  disabled?: boolean;
  onSignUp?: () => void;
}

const LoginButtons: React.FC<LoginButtonsProps> = ({
  loading = false,
  disabled = false,
  onSignUp,
}) => {
  const isLoginDisabled = disabled || loading;
  const loginVariant = isLoginDisabled ? 'grey' : 'main';
  return (
    <div className='flex flex-col gap-3 w-full'>
      <Button
        type='submit'
        variant={loginVariant}
        size='lg'
        shape='rounded'
        disabled={isLoginDisabled}
        fullWidth
      >
        로그인
      </Button>

      {/* 2) 회원가입 버튼 */}
      <Button
        type='button'
        variant='blue20'
        size='lg'
        shape='rounded'
        disabled={false}
        fullWidth
        onClick={onSignUp}
      >
        회원가입
      </Button>
    </div>
  );
};

export default LoginButtons;
