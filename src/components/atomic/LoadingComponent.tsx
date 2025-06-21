interface LoadingComponentProps {
  message?: string;
}

const LoadingComponent = ({ message = '불러오는 중...' }: LoadingComponentProps) => {
  return (
    <div className='flex flex-col items-center justify-center h-[150px] font-sans text-sm text-gray-600'>
      <div className='w-10 h-10 border-4 border-[#001f5c4d] border-t-[#001f5c] rounded-full animate-spin mb-2' />
      <p className='text-[navy] font-bold'>{message}</p>
    </div>
  );
};

export default LoadingComponent;
