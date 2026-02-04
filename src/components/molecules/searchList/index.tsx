import { HighlightedText } from '@/components/atoms/HighlightedText';
import { formatToLocalDate } from '@/utils';

interface SearchListItemProps {
  id: number;
  category: string;
  title: string;
  content: string;
  date: string;
  link: string;
}

const categoryLabel: Record<string, string> = {
  general: '일반',
  academic: '학사',
  scholarship: '장학',
  career: '진로',
  activity: '학생활동',
  rule: '학칙개정',
  REPORT: '보도',
  FREE: '자유',
  NOTICE: '정보',
  SOCIETY: '사회',
};

export default function SearchList({ items }: { items: SearchListItemProps[] }) {
  return (
    <>
      {items.map((item) => (
        <a key={item.id} href={item.link} target='_blank' rel='noopener noreferrer'>
          <div
            className={`border-grey-02 hover:bg-blue-05 h-fit w-full cursor-pointer border-y-1 px-5 py-2.5`}
          >
            <div className='flex flex-col gap-0.5'>
              <span className='text-caption03 text-blue-10'>
                {categoryLabel[item.category] ?? item.category}
              </span>
              <HighlightedText className='text-body05 text-black'>{item.title}</HighlightedText>
              {item.date && (
                <span className='text-caption04 text-grey-30'>{formatToLocalDate(item.date)}</span>
              )}
            </div>
          </div>
        </a>
      ))}
    </>
  );
}
