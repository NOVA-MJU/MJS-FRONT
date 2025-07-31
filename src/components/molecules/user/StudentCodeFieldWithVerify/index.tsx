import React from 'react';
import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';

interface Props {
  studentCode: string;
  setStudentCode: (val: string) => void;
  isStudentCodeValid: boolean;
  isSending: boolean;
  isStuCodeChecked: boolean;
  handleVerifyStudentCode: () => void;
}

const StudentCodeFieldWithVerify: React.FC<Props> = ({
  studentCode,
  setStudentCode,
  isStudentCodeValid,
  isSending,
  isStuCodeChecked,
  handleVerifyStudentCode,
}) => (
  <div className='h-[110px]'>
    <InputField
      label='학번'
      type='text'
      placeholder='ex.60000000'
      value={studentCode}
      onChange={(e) => setStudentCode(e.target.value)}
      error={studentCode !== '' && !isStudentCodeValid}
      helperText={studentCode && !isStudentCodeValid ? '학번 형식이 올바르지 않습니다.' : ''}
      rightElement={
        <Button
          type='button'
          shape='rounded'
          disabled={isSending || !isStudentCodeValid || isStuCodeChecked}
          onClick={handleVerifyStudentCode}
          fullWidth={false}
          variant={
            !studentCode
              ? 'greyLight'
              : isSending
                ? 'greyLight'
                : isStuCodeChecked
                  ? 'greyLight'
                  : 'main'
          }
          className='w-34 h-12 p-2'
        >
          {!studentCode
            ? '중복 확인'
            : isSending
              ? '확인 중...'
              : isStuCodeChecked
                ? '확인 완료'
                : '중복 확인'}
        </Button>
      }
    />
  </div>
);

export default StudentCodeFieldWithVerify;
