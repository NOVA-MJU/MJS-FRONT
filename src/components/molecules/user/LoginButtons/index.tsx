import React from 'react';
import Button from '../../../atoms/button/Button';

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
      {/* 1) 로그인 버튼 */}
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
        variant='greyLight'
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
