export default function AdBannerSection() {
  return (
    <div className='relative flex h-full w-full flex-col bg-gray-200'>
      <div className='flex w-full justify-center pt-3'>
        <div className='flex gap-1.5'>
          <div className='bg-grey-40 h-1.5 w-1.5 rounded-full' />
          <div className='bg-grey-30 h-1.5 w-1.5 rounded-full' />
          <div className='bg-grey-30 h-1.5 w-1.5 rounded-full' />
        </div>
      </div>

      <div className='flex flex-1 items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <p className='text-caption01 text-grey-40'>광고 배너 영역</p>
        </div>
      </div>
    </div>
  );
}
