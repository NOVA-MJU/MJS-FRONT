import React from 'react';
import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';

interface Props {
  nickname: string;
  setNickname: (val: string) => void;
  isSending: boolean;
  isNicknameChecked: boolean;
  handleVerifyNickname: () => void;
  setIsNicknameChecked: (val: boolean) => void;
}

const NicknameFieldWithVerify: React.FC<Props> = ({
  nickname,
  setNickname,
  isSending,
  isNicknameChecked,
  handleVerifyNickname,
  setIsNicknameChecked,
}) => (
  <InputField
    label='닉네임'
    type='text'
    placeholder='닉네임'
    value={nickname}
    onChange={(e) => {
      setNickname(e.target.value);
      setIsNicknameChecked(false);
    }}
    rightElement={
      <Button
        type='button'
        shape='rounded'
        size='sm'
        disabled={isSending || nickname === '' || isNicknameChecked}
        onClick={handleVerifyNickname}
        fullWidth={false}
        variant={
          isNicknameChecked
            ? 'greyLight'
            : isSending
              ? 'greyLight'
              : nickname
                ? 'main'
                : 'greyLight'
        }
        className='w-20 h-10 md:w-34 md:h-12 ml-4 p-2'
      >
        {isNicknameChecked ? '확인 완료' : isSending ? '확인 중...' : '중복 확인'}
      </Button>
    }
  />
);

export default NicknameFieldWithVerify;
