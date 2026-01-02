import React from 'react';
import InputField from '../../common/InputField';

interface Props {
  name: string;
  setName: (val: string) => void;
}

const NameInputField = ({ name, setName }: Props) => (
  <InputField
    label='이름'
    type='text'
    placeholder='홍길동(실명)'
    value={name}
    onChange={(e) => setName(e.target.value)}
    helperText='실명을 입력하지 않을 경우 추후 불이익이 발생할 수 있습니다.'
  />
);

export default NameInputField;
