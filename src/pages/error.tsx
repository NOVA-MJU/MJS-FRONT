import { Link } from 'react-router-dom';
import { Typography } from '../components/atoms/Typography';

export default function GlobalErrorPage() {
  return (
    <div className='w-full h-full flex-1 flex flex-col gap-3 justify-center items-center'>
      <Typography variant='title02'>404 Not Found</Typography>
      <Typography variant='title02'>요청하신 페이지를 찾을 수 없습니다</Typography>
      <Link
        className='w-fit h-fit p-3 rounded-xl flex gap-3 items-center cursor-pointer duration-200 hover:bg-grey-05'
        to={'/'}
      >
        <Typography variant='body03' className='text-blue-10'>
          홈으로 가기
        </Typography>
      </Link>
    </div>
  );
}
