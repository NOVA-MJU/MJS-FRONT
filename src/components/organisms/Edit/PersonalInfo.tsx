import { useAuthStore } from '../../../store/useAuthStore';
import InputField from '../../molecules/common/InputField';
import DropdownField from '../../molecules/common/DropdownField/index.tsx';
import GenderSelector from '../../molecules/user/GenderSelector';
import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
import { DEPARTMENT_OPTIONS } from '../../../constants/departments';

const ALL_DEPARTMENT_OPTIONS = DEPARTMENT_OPTIONS.flatMap((option) => option.departments);
import { uploadProfileImage } from '../../../api/user';
import { genderOptions } from '../../../constants/gender.ts';
import NicknameFieldWithVerify from '@/components/molecules/user/NicknameFieldWithVerify/index.tsx';

//단과대 정보도 추가돼야함
type PersonalInfoProps = {
  nickname: string;
  setNickname: (val: string) => void;
  initialNickname: string;
  isSending: boolean;
  isNicknameChecked: boolean;
  handleVerifyNickname: () => void;
  setIsNicknameChecked: (val: boolean) => void;
  department: string;
  setDepartment: (val: string) => void;
  studentCode: string;
  gender: string;
  setGender: (val: string) => void;
  setUploadedImageUrl: (url: string | null) => void;
  defaultImg: string;
};

const PersonalInfo = ({
  nickname,
  setNickname,
  initialNickname,
  isSending,
  isNicknameChecked,
  handleVerifyNickname,
  setIsNicknameChecked,
  department,
  setDepartment,
  studentCode,
  gender,
  setGender,
  setUploadedImageUrl,
}: PersonalInfoProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className='flex w-full flex-col items-center justify-center rounded-2xl bg-white p-6 md:w-[648px]'>
      <div className='flex w-full flex-col gap-6'>
        <ProfileImageUploader
          defaultImg={user?.profileImageUrl}
          onChange={(file) => {
            const formData = new FormData();
            formData.append('file', file);

            uploadProfileImage(file).then((url) => {
              setUploadedImageUrl(url);
            });
          }}
        />

        <NicknameFieldWithVerify
          nickname={nickname}
          setNickname={setNickname}
          initialNickname={initialNickname}
          isSending={isSending}
          isNicknameChecked={isNicknameChecked}
          handleVerifyNickname={handleVerifyNickname}
          setIsNicknameChecked={setIsNicknameChecked}
        />
        <DropdownField
          label='학과'
          selected={department}
          onSelect={setDepartment}
          options={ALL_DEPARTMENT_OPTIONS}
        />
        <InputField
          label='학번'
          type='text'
          placeholder={`${user?.studentNumber}`}
          value={studentCode}
          disabled={true}
          helperText={'*학번은 수정할 수 없습니다.'}
          showHr={false}
        />
        <GenderSelector
          label='성별'
          options={genderOptions}
          selected={gender}
          onSelect={setGender}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
