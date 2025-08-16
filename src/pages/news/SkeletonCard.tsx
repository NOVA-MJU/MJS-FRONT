function SkeletonCard() {
  return (
    <div className='animate-pulse overflow-hidden rounded-2xl border bg-white'>
      <div className='aspect-[16/9] w-full bg-gray-200' />
      <div className='space-y-3 p-4 md:p-5'>
        <div className='h-4 w-24 rounded bg-gray-200' />
        <div className='h-5 w-11/12 rounded bg-gray-200' />
        <div className='h-5 w-9/12 rounded bg-gray-200' />
        <div className='h-4 w-10/12 rounded bg-gray-200' />
      </div>
    </div>
  );
}

export default SkeletonCard;
