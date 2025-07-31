import { Typography } from '../../atoms/Typography';

interface NoticeItemProps {
  variant: 'notice' | 'community' | 'news';
  title: string;
  imageUrl?: string;
  category?: string;
  content?: string;
}

export default function SearchResultItem({
  variant = 'notice',
  title,
  imageUrl,
  category,
  content,
}: NoticeItemProps) {
  if (variant === 'news')
    return (
      <button className='rounded-xl cursor-pointer p-3 flex gap-6 items-center hover:bg-grey-05'>
        {imageUrl ? (
          <>
            <img className='w-46 h-36 rounded-xl object-cover' src={imageUrl} />
            <div className='flex-1 py-3 flex flex-col gap-3 items-start'>
              <div className='py-1.5 px-3 bg-mju-primary rounded-full'>
                <Typography variant='caption01' className='text-white'>
                  {category}
                </Typography>
              </div>
              <Typography variant='title02'>{title}</Typography>
              <Typography variant='body02'>{content}</Typography>
            </div>
          </>
        ) : (
          <>
            <div className='p-3 flex flex-col gap-3 items-start'>
              <div className='py-1.5 px-3 bg-mju-primary rounded-full'>
                <Typography variant='caption01' className='text-white'>
                  {category}
                </Typography>
              </div>
              <Typography variant='title02'>{title}</Typography>
              <Typography variant='body02'>{content}</Typography>
            </div>
          </>
        )}
      </button>
    );
  else
    return (
      <button className='rounded-xl cursor-pointer p-3 flex gap-6 items-center hover:bg-grey-05'>
        {category && (
          <div className='cursor-pointer py-1.5 px-3 bg-mju-primary rounded-full'>
            <Typography variant='caption01' className='text-white'>
              {category}
            </Typography>
          </div>
        )}
        <Typography variant='body03'>{title}</Typography>
      </button>
    );
}
