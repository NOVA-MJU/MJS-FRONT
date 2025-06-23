import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../../components/atoms/Typography';

export default function BoardWrite() {
  return (
    <div className='w-full h-full px-9 py-12 gap-6 flex flex-col'>
      <Typography variant='heading01' className='text-mju-primary'>
        자유게시판
      </Typography>
      <hr className='w-full h-[4px] bg-gradient-to-r from-blue-05 to-white rounded-full border-0' />

      <div className='w-full flex justify-between'>
        <div className='flex items-center cursor-pointer gap-2'>
          <IoIosArrowBack className='text-[16px] text-blue-10' />
          <Typography variant='body03' className='text-blue-10'>
            이전
          </Typography>
        </div>
        <div className='flex items-center gap-6'>
          <button className='w-46 bg-white border-2 border-grey-10 cursor-pointer p-3 rounded-xl flex'>
            <div className='flex-1'>
              <Typography variant='body02' className='text-black'>
                임시저장
              </Typography>
            </div>
            <Typography variant='body02' className='text-blue-35'>
              00
            </Typography>
          </button>
          <button className='w-46 bg-grey-10 cursor-pointer p-3 rounded-xl'>
            <Typography variant='body02' className='text-black'>
              완료
            </Typography>
          </button>
        </div>
      </div>
      <div className='w-full h-16 p-3 border-2  gap-3 rounded-xl border-blue-05'>
        <input
          className='w-full placeholder-grey-20 font-bold leading-[150%] text-[28px] focus:outline-none'
          placeholder='제목'
        />
      </div>
    </div>
  );
}
