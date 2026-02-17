import { useState } from 'react';
import SearchBar from '../../../components/atoms/SearchBar';
import { Link } from 'react-router-dom';
import Divider from '../../../components/atoms/Divider';
import Pagination from '../../../components/molecules/common/Pagination';

/**
 * 관리자 공지사항 목록 페이지
 *
 * 학과 관리자가 해당 학과의 공지사항 목록을 조회하고 관리할 수 있는 페이지입니다.
 * 검색 기능과 페이지네이션을 제공합니다.
 */
export default function AdminNotice() {
  const [contents] = useState<
    Array<{
      noticeUuid: string;
      title: string;
      previewContent: string;
      createdAt: string;
      thumbnailUrl: string;
    }>
  >([]);
  const [page, setPage] = useState(0);
  const [totalPage] = useState(1);

  return (
    <div className='flex w-full flex-1 flex-col gap-6 px-7 py-12'>
      <p className='text-heading01 text-mju-primary'>학생회 공지사항 관리</p>
      <SearchBar domain='notice' />
      <Divider />
      <div className='flex h-fit w-full justify-end'>
        <div className='flex gap-6'>
          <Link
            className='bg-blue-35 cursor-pointer rounded-xl px-8 py-3 text-center md:px-16'
            to='write'
          >
            <p className='text-body02 text-white'>작성</p>
          </Link>
        </div>
      </div>
      <div className='flex w-full flex-1 flex-col gap-3 p-3'>
        {contents.map((content) => (
          <NoticeItem
            key={content.noticeUuid}
            uuid={content.noticeUuid}
            title={content.title}
            content={content.previewContent}
            date={content.createdAt}
            thumbnailUrl={content.thumbnailUrl}
          />
        ))}
        {contents.length === 0 && (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-title02'>아직 작성된 공지사항이 없습니다</p>
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPage} onChange={setPage} />
    </div>
  );
}

interface NoticeItemProps {
  uuid: string;
  title: string;
  content: string;
  date: string;
  thumbnailUrl?: string;
}

const NoticeItem = ({ uuid, title, content, date, thumbnailUrl }: NoticeItemProps) => {
  return (
    <Link
      className='hover:bg-grey-05 flex cursor-pointer items-center gap-4 rounded-lg p-3 md:gap-8'
      to={uuid}
    >
      {thumbnailUrl && <img className='aspect-square w-20 rounded-lg md:w-24' src={thumbnailUrl} />}
      <div className='flex flex-1 flex-col items-start gap-1 md:gap-3'>
        <p className='text-body02'>{title}</p>
        <p className='text-body03 line-clamp-2 break-all'>{content}</p>
      </div>
      <p className='text-body03 text-grey-40'>{date.slice(0, 10)}</p>
    </Link>
  );
};
