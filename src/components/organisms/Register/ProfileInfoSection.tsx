import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
interface Props {
  setProfileImageFile: (file: File | null) => void;
}

const ProfileInfoSection = ({ setProfileImageFile }: Props) => {
  return (
    <section>
      <p className='mb-6 flex w-fit px-1 text-xl font-bold text-[#000000] md:text-3xl'>
        프로필 사진(선택)
      </p>
      <div className='flex flex-col gap-12 rounded-xl bg-white p-6'>
        <div className='my-6 flex w-full flex-col gap-6 md:mx-auto md:w-[80%] md:gap-12'>
          <ProfileImageUploader onChange={setProfileImageFile} />
        </div>
      </div>
    </section>
  );
};

export default ProfileInfoSection;
