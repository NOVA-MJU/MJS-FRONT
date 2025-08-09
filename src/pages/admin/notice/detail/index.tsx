import { Typography } from '../../../../components/atoms/Typography';
import { useNavigate } from 'react-router-dom';
import Divider from '../../../../components/atoms/Divider';
import NavigationUp from '../../../../components/molecules/NavigationUp';

export default function AdminNoticeDetail() {
  const navigate = useNavigate();

  return (
    <div className='w-full flex-1 px-7 py-12 flex flex-col gap-6'>
      <div className='w-full flex justify-between'>
        <NavigationUp onClick={() => navigate(-1)} />
      </div>
      <div className='flex flex-col p-3 gap-3'>
        <Typography variant='heading02'>제목이들어갑니다</Typography>
        <div className='flex justify-end'>
          <Typography variant='body03' className='text-grey-40'>
            {`${'날짜가들어갑니다'} | ${'작성자이름이들어갑니다'}`}
          </Typography>
        </div>
      </div>
      <Divider variant='thin' />
    </div>
  );
}
