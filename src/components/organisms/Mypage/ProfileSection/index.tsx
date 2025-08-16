import ProfileCard from '../../../molecules/user/ProfileCard';

const ProfileSection = () => {
  return (
    <div className='w-full md:w-[600px]'>
      <p className='text-mju-primary text-xl md:text-3xl font-bold mb-6 mt-8'>프로필</p>
      <ProfileCard />
    </div>
  );
};

export default ProfileSection;
