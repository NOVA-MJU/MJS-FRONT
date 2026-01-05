import React, { useState, useEffect } from 'react';
import ActivitiesSection from '../../components/organisms/Mypage/ActivitiesSection';
import Button from '../../components/atoms/Button/Button';
import { getProfileStats, type ProfileStatsRes } from '../../api/mypage';
import { deleteUser } from '../../api/user';
import InputModal from '../../components/molecules/Modal/InputModal';
import { Typography } from '../../components/atoms/Typography';
import ProfileCard from '../../components/molecules/user/ProfileCard';
import LabelButton from '../../components/atoms/Button/LabelButton';
import { handleError } from '../../utils/error';
import toast from 'react-hot-toast';

const Mypage = () => {
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
    <div className='w-full flex-1 bg-grey-05 flex flex-col p-6 md:p-12 gap-8'>
      <Typography variant='heading01' className='text-mju-primary'>
        마이페이지
      </Typography>
      <div className='flex justify-center'>
        <div className='w-full max-w-192 flex flex-col gap-8'>
          <div className='flex flex-col gap-2'>
            <Typography variant='title02' className='text-mju-primary'>
              프로필
            </Typography>
            <ProfileCard />
          </div>
          <ActivitiesSection
            postCount={stateData?.postCount || 0}
            commentCount={stateData?.commentCount || 0}
            likedCount={stateData?.likedPostCount || 0}
          />
          <div className='flex flex-col gap-2'>
            <Typography variant='title02' className='text-mju-primary'>
              정보
            </Typography>
            <div className='min-h-32 flex flex-col justify-center bg-white rounded-lg p-8 gap-8 '>
              <LabelButton label='커뮤니티 이용 규칙' />
              <hr className='text-grey-10 border-1' />
              <LabelButton label='서비스 이용 약관' />
              <hr className='text-grey-10 border-1' />
              <LabelButton label='개인정보 처리 방침' />
            </div>
          </div>
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
