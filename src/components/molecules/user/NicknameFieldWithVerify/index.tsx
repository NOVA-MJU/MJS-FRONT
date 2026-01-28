import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';
import { useMemo } from 'react';

interface Props {
  nickname: string;
  setNickname: (val: string) => void;
  isSending: boolean;
  isNicknameChecked: boolean;
  handleVerifyNickname: () => void;
  setIsNicknameChecked: (val: boolean) => void;
}

const NicknameFieldWithVerify = ({
  nickname,
  setNickname,
  isSending,
  isNicknameChecked,
  handleVerifyNickname,
  setIsNicknameChecked,
}: Props) => {
  const isValidName = useMemo(() => {
    if (!nickname) return true;

    if (/\d/.test(nickname)) return false;
    if (nickname.length > 30) return false;
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(nickname)) return false;

    return true;
  }, [nickname]);

  const showError = nickname.length > 0 && !isValidName;
  return (
    <div>
      <InputField
        label='닉네임'
        type='text'
        placeholder='닉네임'
        value={nickname}
        error={showError}
        helperText={showError ? '정확한 단어로 입력해 주세요.' : ''}
        onChange={(e) => {
          setNickname(e.target.value);
          setIsNicknameChecked(false);
        }}
        rightElement={
          <Button
            type='button'
            shape='rounded'
            size='sm'
            disabled={isSending || nickname === '' || isNicknameChecked || showError}
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
            className='ml-4 h-10 w-20 p-2 md:h-12 md:w-34'
          >
            {isNicknameChecked ? '확인 완료' : isSending ? '확인 중...' : '중복 확인'}
          </Button>
        }
      />
    </div>
  );
};

export default NicknameFieldWithVerify;
