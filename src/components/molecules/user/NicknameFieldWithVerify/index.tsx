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
        className='w-34 h-12 p-2'
      >
        {isNicknameChecked ? '확인 완료' : isSending ? '확인 중...' : '중복 확인'}
      </Button>
    }
  />
);

export default NicknameFieldWithVerify;
