import DOMPurify from 'dompurify';
import { Typography } from '../../atoms/Typography';

interface NoticeItemProps {
  variant: 'notice' | 'community' | 'news';
  title: string;
  imageUrl?: string;
  category?: string;
  content?: string;
  link: string;
}

export default function SearchResultItem({
  variant = 'notice',
  title,
  imageUrl,
  category,
  content,
  link,
}: NoticeItemProps) {
  const safeTitle = DOMPurify.sanitize(title, {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });
  const safeContent = DOMPurify.sanitize(content ?? '', {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });

  const renderText = (html: string, variant: Parameters<typeof Typography>[0]['variant']) => (
    <Typography
      variant={variant}
      className='search-result__highlight'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (variant === 'news')
    return (
      <a
        className='rounded-xl cursor-pointer p-3 flex gap-6 items-center hover:bg-grey-05'
        target='_blank'
        rel='noopener noreferrer'
        href={link}
      >
        {imageUrl ? (
          <>
            <img className='w-46 h-36 rounded-xl object-cover' src={imageUrl} />
            <div className='flex-1 py-3 flex flex-col gap-3 items-start'>
              <div className='py-1.5 px-3 bg-mju-primary rounded-full'>
                <Typography variant='caption01' className='text-white'>
                  {category}
                </Typography>
              </div>
              {renderText(safeTitle, 'title02')}
              {renderText(safeContent, 'body02')}
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
              {renderText(safeTitle, 'title02')}
              {renderText(safeContent, 'body02')}
            </div>
          </>
        )}
      </a>
    );
  else
    return (
      <a
        className='rounded-xl cursor-pointer p-3 flex gap-6 items-center hover:bg-grey-05'
        target='_blank'
        rel='noopener noreferrer'
        href={link}
      >
        {category && (
          <div className='cursor-pointer py-1.5 px-3 bg-mju-primary rounded-full'>
            <Typography variant='caption01' className='text-white'>
              {category}
            </Typography>
          </div>
        )}
        {renderText(safeTitle, 'body03')}
      </a>
    );
}
