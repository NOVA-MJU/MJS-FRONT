import { useAuthStore } from '../../../store/useAuthStore';
import InputField from '../../molecules/common/InputField';
import DropdownField from '../../molecules/common/DropdownField/index.tsx';
import GenderSelector from '../../molecules/user/GenderSelector';
import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
import { DEPARTMENT_OPTIONS } from '../../../constants/departments';

const ALL_DEPARTMENT_OPTIONS = DEPARTMENT_OPTIONS.flatMap((option) => option.departments);
import { uploadProfileImage } from '../../../api/user';
import { genderOptions } from '../../../constants/gender.ts';

type PersonalInfoProps = {
  nickname: string;
  setNickname: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  studentCode: string;
  setStudentCode: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  setUploadedImageUrl: (url: string | null) => void;
  defaultImg: string;
};

const PersonalInfo = ({
  nickname,
  setNickname,
  department,
  setDepartment,
  studentCode,
  setStudentCode,
  gender,
  setGender,
  setUploadedImageUrl,
}: PersonalInfoProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className='flex min-h-[770px] w-full flex-col items-center justify-center rounded-2xl bg-white md:w-[648px]'>
      <div className='flex w-[80%] flex-col gap-12 md:w-[440px]'>
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

        <InputField
          label='닉네임'
          type='text'
          placeholder={`${user?.nickname}`}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
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
          onChange={(e) => setStudentCode(e.target.value)}
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
