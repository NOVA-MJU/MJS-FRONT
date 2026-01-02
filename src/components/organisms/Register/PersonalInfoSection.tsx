import React from 'react';
import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
import NameInputField from '../../molecules/user/NameInputField';
import NicknameFieldWithVerify from '../../molecules/user/NicknameFieldWithVerify';
import DepartmentDropdownField from '../../molecules/user/DepartmentDropdownField';
import StudentCodeFieldWithVerify from '../../molecules/user/StudentCodeFieldWithVerify';
import GenderSelector from '../../molecules/user/GenderSelector';
import { genderOptions } from '../../../constants/gender';

interface Props {
  profileImageFile: File | null;
  setProfileImageFile: (file: File | null) => void;
  name: string;
  setName: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  studentCode: string;
  setStudentCode: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  isSending: boolean;
  isNicknameChecked: boolean;
  isStuCodeChecked: boolean;
  isStudentCodeValid: boolean;
  handleVerifyNickname: () => void;
  handleVerifyStudentCode: () => void;
  setIsNicknameChecked: (val: boolean) => void;
}

const PersonalInfoSection = ({
  setProfileImageFile,
  name,
  setName,
  nickname,
  setNickname,
  department,
  setDepartment,
  studentCode,
  setStudentCode,
  gender,
  setGender,
  isSending,
  isNicknameChecked,
  isStuCodeChecked,
  isStudentCodeValid,
  handleVerifyNickname,
  handleVerifyStudentCode,
  setIsNicknameChecked,
}: Props) => {
  return (
    <section>
      <p className='text-xl md:text-3xl font-bold my-6 text-mju-primary'>개인 정보</p>
      <div className='flex flex-col bg-white min-h-[540px] p-6 rounded-xl gap-12'>
        <div className='flex flex-col md:mx-auto gap-6 md:gap-12 my-6'>
          <ProfileImageUploader onChange={setProfileImageFile} />
          <NameInputField name={name} setName={setName} />
          <NicknameFieldWithVerify
            nickname={nickname}
            setNickname={setNickname}
            isSending={isSending}
            isNicknameChecked={isNicknameChecked}
            handleVerifyNickname={handleVerifyNickname}
            setIsNicknameChecked={setIsNicknameChecked}
          />
          <DepartmentDropdownField department={department} setDepartment={setDepartment} />
          <StudentCodeFieldWithVerify
            studentCode={studentCode}
            setStudentCode={setStudentCode}
            isStudentCodeValid={isStudentCodeValid}
            isSending={isSending}
            isStuCodeChecked={isStuCodeChecked}
            handleVerifyStudentCode={handleVerifyStudentCode}
          />
          <GenderSelector
            label='성별'
            options={genderOptions}
            selected={gender}
            onSelect={setGender}
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
