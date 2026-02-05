import { HighlightedText } from '@/components/atoms/HighlightedText';
import { formatToLocalDate } from '@/utils';
import { extractYoutubeId } from '.';

interface BroadcastCardProps {
  title: string;
  url: string;
  playlistTitle: string | null;
  publishedAt: string;
}

export default function BroadcastCard({
  title,
  url,
  playlistTitle,
  publishedAt,
}: BroadcastCardProps) {
  return (
    <div className='flex flex-1 flex-col gap-4 p-5'>
      <article key={url} className='flex flex-col'>
        <iframe
          className='h-54 w-full rounded-t-[8px] rounded-b-none'
          src={`https://www.youtube.com/embed/${extractYoutubeId(url)}`}
          title={title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
        <div className='border-grey-10 rounded-t-none rounded-b-[8px] border px-4 py-2'>
          <div className='flex flex-col gap-1'>
            <HighlightedText className='text-body04 text-black'>{title}</HighlightedText>
            {playlistTitle && (
              <HighlightedText className='text-body05 text-grey-40'>
                {playlistTitle}
              </HighlightedText>
            )}
            <span className='text-caption04 text-grey-40'>{formatToLocalDate(publishedAt)}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
