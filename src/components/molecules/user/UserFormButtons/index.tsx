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
  const loginVariant = isLoginDisabled ? 'grey40' : 'main';
  return (
    <div className='flex w-full flex-col gap-2'>
      <Button
        type='submit'
        variant={loginVariant}
        size='md'
        shape='rounded'
        disabled={isLoginDisabled}
        fullWidth
        className='text-body05 block md:hidden'
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
        className='text-body05 hidden md:block'
      >
        {label}
      </Button>

      <Button
        type='button'
        variant='greyLight'
        size='md'
        shape='rounded'
        disabled={false}
        fullWidth
        onClick={onSignUp}
        className='text-body05 block md:hidden'
      >
        회원가입
      </Button>
      <Button
        type='button'
        variant='greyLight'
        size='lg'
        shape='rounded'
        disabled={false}
        fullWidth
        onClick={onSignUp}
        className='text-body05 hidden md:block'
      >
        회원가입
      </Button>
    </div>
  );
};

export default UserFormButtons;
