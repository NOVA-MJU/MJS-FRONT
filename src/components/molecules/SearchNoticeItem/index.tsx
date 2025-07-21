import { Typography } from '../../atoms/Typography';

interface NoticeItemProps {
  badgeTitle?: string;
  title: string;
}

export default function SearchNoticeItem({ badgeTitle, title }: NoticeItemProps) {
  return (
    <button className='cursor-pointer p-3 flex gap-6 items-center'>
      {badgeTitle && (
        <button className='cursor-pointer py-1.5 px-3 bg-mju-primary rounded-full'>
          <Typography variant='caption01' className='text-white'>
            {badgeTitle}
          </Typography>
        </button>
      )}
      <Typography variant='body03'>{title}</Typography>
    </button>
  );
}
