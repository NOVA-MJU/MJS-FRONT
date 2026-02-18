import React, { useState, useEffect } from 'react';
import ActivitiesSection from '../../components/organisms/Mypage/ActivitiesSection';
import { getProfileStats, type ProfileStatsRes } from '../../api/mypage';
import { deleteUser } from '../../api/user';
import InputModal from '../../components/molecules/Modal/InputModal';
import ProfileCard from '../../components/molecules/user/ProfileCard';
import LabelButton from '../../components/atoms/Button/LabelButton';
import { handleError } from '../../utils/error';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import LoginErrorPage from '../LoginError';

const Mypage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [stateData, setStateData] = useState<ProfileStatsRes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleDeleteSubmit = async (pw: string) => {
    try {
      const status = await deleteUser(pw);
      if (status === 200) {
        toast.success('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        // logout();
        window.location.href = '/';
      }
    } catch (error) {
      handleError(error, '회원 탈퇴 처리 중 오류가 발생했습니다.', { showToast: false });
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
        handleError(err, '마이페이지 데이터를 불러오는 중 오류가 발생했습니다.', {
          showToast: false,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className='bg-grey-02 flex w-full flex-1 flex-col gap-8 p-6 md:p-12'>
      <p className='text-title01 text-black md:text-4xl'>마이페이지</p>
      {user ? (
        <>
          <div className='flex justify-center'>
            <div className='flex w-full max-w-192 flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <p className='text-title03 text-black md:text-4xl'>프로필</p>
                <ProfileCard />
              </div>
              <ActivitiesSection
                postCount={stateData?.postCount || 0}
                commentCount={stateData?.commentCount || 0}
                likedCount={stateData?.likedPostCount || 0}
              />
              <div className='flex flex-col gap-2'>
                <p className='text-title03 text-grey-80 md:text-4xl'>정보</p>
                <div className='flex min-h-32 flex-col justify-center gap-4 rounded-lg bg-white p-5'>
                  <LabelButton label='커뮤니티 이용 규칙' />
                  <hr className='text-grey-02 border-1' />
                  <LabelButton label='서비스 이용 약관' />
                  <hr className='text-grey-02 border-1' />
                  <LabelButton label='개인정보 처리 방침' />
                </div>
              </div>
              <div
                className='text-body05 text-grey-30 mt-[-12px] flex w-fit cursor-pointer'
                onClick={() => setIsModalOpen(true)}
              >
                탈퇴하기
              </div>
            </div>
          </div>
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
        </>
      ) : (
        <LoginErrorPage />
      )}
    </div>
  );
};

export default Mypage;
