import type { NewsInfo } from '../../types/news/newsInfo';
import { memo } from 'react';
interface NewsCardProps {
  news: NewsInfo;
  index: number;
  page: number;
  fallbackSrc?: string;
}
const ITEMS_PER_PAGE = 8; // 한 페이지에 8개가 적당.

function NewsCard({ news, index, page, fallbackSrc = '/default-thumbnail.png' }: NewsCardProps) {
  const id = (page - 1) * ITEMS_PER_PAGE + index + 1;

  return (
    <article
      className='group relative flex flex-col overflow-hidden rounded-2xl border-grey-20 bg-white shadow-sm transition hover:shadow-lg'
      aria-labelledby={`news-${id}-title`}
    >
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

        <div className='flex flex-col gap-2 p-4 md:p-5'>
          <div className='flex items-center gap-2 text-xs md:text-[13px]'>
            <span className='inline-flex items-center rounded-full px-2 py-0.5 font-medium text-gray-600'>
              {news.category}
            </span>
            <time className='text-gray-500'>{news.date}</time>
          </div>

          <h3
            id={`news-${id}-title`}
            className='line-clamp-2 text-base font-semibold leading-snug md:text-lg'
          >
            {news.title}
          </h3>

          <p className='line-clamp-2 text-sm text-grey-40 md:line-clamp-3'>{news.summary}</p>
        </div>
      </a>
    </article>
  );
}
export default memo(NewsCard);
