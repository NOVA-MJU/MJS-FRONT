import { useAuthStore } from '../../../store/useAuthStore';
import InputField from '../../molecules/common/InputField';
import DropdownField from '../../molecules/common/DropdownField/index.tsx';
import GenderSelector from '../../molecules/user/GenderSelector';
import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
import { DEPARTMENT_OPTIONS } from '../../../constants/departments';
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

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  nickname,
  setNickname,
  department,
  setDepartment,
  studentCode,
  setStudentCode,
  gender,
  setGender,

  setUploadedImageUrl,
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className='w-[648px] min-h-[770px] bg-white flex flex-col justify-center items-center rounded-2xl'>
      <div className='w-[440px] flex flex-col gap-12 '>
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
          options={DEPARTMENT_OPTIONS}
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
