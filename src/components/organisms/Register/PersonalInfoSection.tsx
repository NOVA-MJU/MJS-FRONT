import NameInputField from '../../molecules/user/NameInputField';
import NicknameFieldWithVerify from '../../molecules/user/NicknameFieldWithVerify';
import DepartmentDropdownField from '../../molecules/user/DepartmentDropdownField';
import StudentCodeFieldWithVerify from '../../molecules/user/StudentCodeFieldWithVerify';
import GenderSelector from '../../molecules/user/GenderSelector';
import { genderOptions } from '../../../constants/gender';
import { DEPARTMENT_OPTIONS } from '../../../constants/departments';
import { COLLEGE_OPTIONS } from '../../../constants/colleges';
import { useEffect, useState } from 'react';

interface Props {
  name: string;
  setName: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  college: string;
  setCollege: (val: string) => void;
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

interface Options {
  label: string;
  value: string;
}

const PersonalInfoSection = ({
  name,
  setName,
  nickname,
  setNickname,
  college,
  setCollege,
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
  const [departmentOptions, setDepartmentOptions] = useState<Options[]>([]);

  useEffect(() => {
    console.log(college);
    const departmentData = DEPARTMENT_OPTIONS.find((dept) => dept.college === college);
    if (departmentData) {
      console.log(departmentData.departments);
      setDepartmentOptions(departmentData.departments);
    }
  }, [college]);

  return (
    <section>
      <p className='my-6 flex w-fit px-1 text-xl font-bold text-[#000000] md:text-3xl'>
        기본 정보*
      </p>
      <div className='flex min-h-[540px] flex-col gap-12 rounded-xl bg-white p-6'>
        <div className='my-6 flex w-full flex-col gap-6 md:mx-auto md:w-[80%] md:gap-12'>
          <NameInputField name={name} setName={setName} />
          <NicknameFieldWithVerify
            nickname={nickname}
            setNickname={setNickname}
            isSending={isSending}
            isNicknameChecked={isNicknameChecked}
            handleVerifyNickname={handleVerifyNickname}
            setIsNicknameChecked={setIsNicknameChecked}
          />
          <DepartmentDropdownField
            label='단과대'
            options={COLLEGE_OPTIONS}
            department={college}
            setDepartment={setCollege}
          />
          <DepartmentDropdownField
            label='학과'
            options={departmentOptions}
            department={department}
            setDepartment={setDepartment}
          />
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
