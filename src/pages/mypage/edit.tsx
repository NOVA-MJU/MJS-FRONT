import { useEffect, useState } from 'react';
import RequiredInfo from '../../components/organisms/Edit/RequiredInfo';
import PersonalInfo from '../../components/organisms/Edit/PersonalInfo';
import Button from '../../components/atoms/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { updateMemberInfo } from '../../api/mypage';
import { saveUserInfo } from '../../api/user';
import { useNavigate } from 'react-router-dom';

const Edit: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigator = useNavigate();

  // 필수 정보
  const [currentPw, setCurrentPw] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [openForm, setOpenForm] = useState(false);

  // 개인 정보
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [department, setDepartment] = useState(user?.departmentName ?? '');
  const [studentCode, setStudentCode] = useState(user?.studentNumber ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const profileImageUrl = uploadedImageUrl ?? '';
      if (!user) return;

      await updateMemberInfo({
        name: user.name,
        nickname,
        gender,
        departmentName: department,
        studentNumber: studentCode,
        profileImageUrl,
      });
      const updatedUserInfo = await saveUserInfo();
      setUser(updatedUserInfo);
      alert('회원 정보가 수정되었습니다.');
      navigator(`/mypage/${user?.uuid}`);
    } catch (error) {
      console.error('[오류] 정보 수정 중 오류 발생:', error);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (user) {
      setNickname(user.nickname ?? '');
      setDepartment(user.departmentName ?? '');
      setStudentCode(user.studentNumber ?? '');
      setGender(user.gender ?? '');
    }
  }, [user]);

  return (
    <div className='bg-grey-05 w-full md:w-[1280px] min-h-screen flex flex-col justify-center items-center mx-auto p-6 md:p-12'>
      <p className='w-full self-start text-2xl md:text-4xl font-bold text-mju-primary'>
        프로필 수정
      </p>
      <div className='w-full md:w-[648px] flex flex-col mt-10 gap-6 md:gap-12'>
        <div>
          <p className='w-full text-xl md:text-3xl font-semibold text-mju-primary mb-6'>
            필수 정보
          </p>
          <RequiredInfo
            currentPw={currentPw}
            setCurrentPw={setCurrentPw}
            pw={pw}
            setPw={setPw}
            confirmPw={confirmPw}
            setConfirmPw={setConfirmPw}
            openForm={openForm}
            setOpenForm={setOpenForm}
          />
        </div>
        <div>
          <p className='w-full text-xl md:text-3xl font-semibold text-mju-primary mb-6'>
            개인 정보
          </p>
          <PersonalInfo
            nickname={nickname}
            setNickname={setNickname}
            department={department}
            setDepartment={setDepartment}
            studentCode={studentCode}
            setStudentCode={setStudentCode}
            gender={gender}
            setGender={setGender}
            setUploadedImageUrl={setUploadedImageUrl}
            defaultImg={user?.profileImageUrl ?? ''}
          />
        </div>
        <Button
          variant='blue35'
          shape='rounded'
          size='lg'
          disabled={false}
          fullWidth={true}
          onClick={handleSave}
        >
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default Edit;
