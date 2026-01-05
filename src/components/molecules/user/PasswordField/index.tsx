import InputField from '../../common/InputField';

interface Props {
  pw: string;
  setPw: (val: string) => void;
}

const PasswordField = ({ pw, setPw }: Props) => (
  <div>
    <InputField
      label='비밀번호'
      type='password'
      autoComplete='new-password'
      placeholder='비밀번호를 입력하세요'
      value={pw}
      onChange={(e) => setPw(e.target.value)}
    />
    <div className='flex flex-col ml-1 mt-2 text-xs text-grey-40'>
      <p>8~16자의 영문 대소문자</p>
      <p>숫자 1개 이상 포함</p>
      <p>특수문자 1개 이상 포함</p>
    </div>
  </div>
);

export default PasswordField;
