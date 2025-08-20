import DOMPurify from 'dompurify';
import { Typography } from '../../components/atoms/Typography';
import { NewsCategoryLabel } from '../../constants/news';
import type { NewsInfo } from '../../types/news/newsInfo';
import { formatToLocalTime } from '../../utils';

interface NewsCardProps {
  news: NewsInfo;
  fallbackSrc?: string;
}

function NewsCard({ news, fallbackSrc = '/default-thumbnail.png' }: NewsCardProps) {
  /**
   * 검색어 highlight를 위해 텍스트를 sanitize 하고, em 태그를 허용합니다.
   */
  const safeTitle = DOMPurify.sanitize(news.title, {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });
  const safeContent = DOMPurify.sanitize(news.summary ?? '', {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });

  return (
    <article className='group relative flex flex-col overflow-hidden rounded-2xl border-grey-20 bg-white shadow-sm transition hover:shadow-lg'>
      <a href={news.link} target='_blank' rel='noopener noreferrer' className='block'>
        <div className='aspect-[16/9] w-full overflow-hidden bg-gray-100'>
          <img
            src={news.imageUrl?.trim() || fallbackSrc}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackSrc;
            }}
            alt={news.title}
            className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]'
            loading='lazy'
            sizes='(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw'
          />
        </div>
        <div className='flex flex-col gap-2 p-4'>
          <div className='flex items-center gap-4'>
            <Typography variant='caption02'> {NewsCategoryLabel[news.category]}</Typography>
            <time className='text-gray-500'>{formatToLocalTime(news.date)}</time>
          </div>
          <Typography
            variant='title02'
            className='line-clamp-2 search-result__highlight'
            dangerouslySetInnerHTML={{ __html: safeTitle }}
          />
          <Typography
            variant='body03'
            className='text-grey-40 line-clamp-2 md:line-clamp-3 search-result__highlight'
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>
      </a>
    </article>
  );
}

export default NewsCard;
