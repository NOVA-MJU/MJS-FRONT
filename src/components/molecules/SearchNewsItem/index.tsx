import { Typography } from '../../atoms/Typography';

interface NewsItemProps {
  imageUrl?: string;
  category: string;
  title: string;
  content: string;
}

export default function SearchNewsItem({ imageUrl, category, title, content }: NewsItemProps) {
  return (
    <button className='rounded-xl cursor-pointer p-3 flex gap-6 items-center hover:bg-grey-05'>
      {imageUrl ? (
        <>
          <img className='w-46 h-36 rounded-xl object-cover' src={imageUrl} />
          <div className='flex-1 py-3 flex flex-col gap-3 items-start'>
            <button className='py-1.5 px-3 bg-mju-primary rounded-full'>
              <Typography variant='caption01' className='text-white'>
                {category}
              </Typography>
            </button>
            <Typography variant='title02'>{title}</Typography>
            <Typography variant='body02'>{content}</Typography>
          </div>
        </>
      ) : (
        <>
          <div className='p-3 flex flex-col gap-3 items-start'>
            <button className='py-1.5 px-3 bg-mju-primary rounded-full'>
              <Typography variant='caption01' className='text-white'>
                {category}
              </Typography>
            </button>
            <Typography variant='title02'>{title}</Typography>
            <Typography variant='body02'>{content}</Typography>
          </div>
        </>
      )}
    </button>
  );
}
