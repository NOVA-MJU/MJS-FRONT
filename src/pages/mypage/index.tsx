import React from 'react';
import ProfileSection from '../../components/organisms/Mypage/ProfileSection';
import ActivitiesSection from '../../components/organisms/Mypage/ActivitiesSection';
import InfoSection from '../../components/organisms/Mypage/InfoSection';
import Button from '../../components/atoms/Button/Button';

const Mypage: React.FC = () => {
  return (
    <div className='bg-grey-05 w-[1280px] min-h-screen flex flex-col mx-auto p-12'>
      {/* 제목: 왼쪽 정렬 */}
      <p className='text-4xl font-bold text-blue-900 text-mju-primary'>마이페이지</p>

      {/* 가운데 정렬 영역 */}
      <div className='w-full flex flex-col justify-center items-center mt-10 gap-12'>
        <ProfileSection />
        <ActivitiesSection />
        <InfoSection />
        <div className='w-[600px]'>
          <Button variant='borderRed' disabled={false} fullWidth={true} shape='rounded'>
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
