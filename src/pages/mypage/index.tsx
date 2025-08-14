import React, { useState, useEffect } from 'react';
import ProfileSection from '../../components/organisms/Mypage/ProfileSection';
import ActivitiesSection from '../../components/organisms/Mypage/ActivitiesSection';
import InfoSection from '../../components/organisms/Mypage/InfoSection';
import Button from '../../components/atoms/Button/Button';
import { getProfileStats, type ProfileStatsRes } from '../../api/mypage';
import { deleteUser } from '../../api/user';
import InputModal from '../../components/molecules/Modal/InputModal';

const Mypage: React.FC = () => {
  const [stateData, setStateData] = useState<ProfileStatsRes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleDeleteSubmit = async (pw: string) => {
    try {
      const status = await deleteUser(pw);
      if (status === 200) {
        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        // logout();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('[탈퇴 요청 에러]', error);
      setHasError(true);
    } finally {
      setIsModalOpen(false);
      setPassword('');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPassword('');
    setHasError(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfileStats();
        setStateData(data);
      } catch (err) {
        console.error('마이페이지 데이터 불러오기 실패', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='bg-grey-05 w-full md:w-[1280px] min-h-screen flex flex-col mx-auto p-6 md:p-12'>
      <p className='text-2xl md:text-4xl font-bold text-blue-900 text-mju-primary'>마이페이지</p>

      <div className='w-full flex flex-col justify-center items-center md:mt-10 gap-6 md:gap-12'>
        <ProfileSection />
        <ActivitiesSection
          postCount={stateData?.postCount || 0}
          commentCount={stateData?.commentCount || 0}
          likedCount={stateData?.likedPostCount || 0}
        />
        <InfoSection />
        <div className='w-full md:w-[600px]'>
          <Button
            variant='borderRed'
            disabled={false}
            fullWidth={true}
            shape='rounded'
            onClick={() => setIsModalOpen(true)}
          >
            탈퇴하기
          </Button>
        </div>
      </div>

      {/*  비밀번호 입력 모달 */}
      <InputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleDeleteSubmit}
        value={password}
        onChange={(val) => {
          setPassword(val);
          if (hasError) setHasError(false);
        }}
        title='회원 탈퇴'
        description='탈퇴 시 복구할 수 없습니다. 정말 탈퇴하시겠습니까?'
        placeholder='비밀번호 입력'
        confirmLabel='탈퇴하기'
        type='password'
        error={hasError}
        helperText='비밀번호가 일치하지 않습니다.'
        disabled={!password.trim()}
      />
    </div>
  );
};

export default Mypage;
