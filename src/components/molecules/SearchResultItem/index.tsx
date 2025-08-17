import DOMPurify from 'dompurify';
import { Typography } from '../../atoms/Typography';
import Chip from '../../atoms/Chip';

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
  /**
   * 검색어 highlight를 위해 텍스트를 sanitize 하고, em 태그를 허용합니다.
   */
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
      className='search-result__highlight line-clamp-2'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (variant === 'news')
    return (
      <a
        className='rounded-lg cursor-pointer p-1 md:p-3 flex gap-3 md:gap-6 items-center hover:bg-grey-05'
        target='_blank'
        rel='noopener noreferrer'
        href={link}
      >
        {imageUrl && (
          <img className='w-24 h-18 md:w-46 md:h-36 rounded-lg object-cover' src={imageUrl} />
        )}
        <div className='flex-1 py-3 flex flex-col gap-2 md:gap-3 items-start'>
          <Chip selected variant='caption02'>
            {category}
          </Chip>
          {renderText(safeTitle, 'title02')}
          {renderText(safeContent, 'body02')}
        </div>
      </a>
    );
  else
    return (
      <a
        className='rounded-lg cursor-pointer p-1 md:p-3 flex gap-3 md:gap-6 items-center hover:bg-grey-05'
        target='_blank'
        rel='noopener noreferrer'
        href={link}
      >
        {category && (
          <Chip selected variant='caption02'>
            {category}
          </Chip>
        )}
        {renderText(safeTitle, 'body03')}
      </a>
    );
}
