import { useEffect, useState } from 'react';
import SearchBar from '../../../components/atoms/SearchBar';
import { Typography } from '../../../components/atoms/Typography';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Divider from '../../../components/atoms/Divider';
import { getDepartmentNotices, type DepartmentNoticeItem } from '../../../api/departments';
import Pagination from '../../../components/molecules/common/Pagination';

const PAGINATION_LENGTH = 10;

export default function AdminNotice() {
  const { departmentUuid } = useParams<{ departmentUuid: string }>();
  const [, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [contents, setContents] = useState<DepartmentNoticeItem[]>([]);
  const [, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  /**
   * 검색을 수행할 함수 작성
   */
  function handleSubmit(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSearchParams({ search: trimmed });
  }

  /**
   * 공지사항 목록의 첫 페이지를 조회합니다
   */
  useEffect(() => {
    (async () => {
      if (!departmentUuid) return;
      setIsLoading(true);
      try {
        const res = await getDepartmentNotices(departmentUuid, page, PAGINATION_LENGTH);
        console.log(res);
        setContents(res.content);
        setTotalPage(res.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [departmentUuid, page]);

  return (
    <div className='w-full flex-1 px-7 py-12 flex flex-col gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        학생회 공지사항 관리
      </Typography>
      <SearchBar
        placeholder='검색어를 입력하세요'
        value={searchKeyword}
        onTextChange={setSearchKeyword}
        onSubmit={handleSubmit}
      />
      <Divider />
      <div className='w-full h-fit flex justify-end'>
        <div className='flex gap-6'>
          <Link className='w-45 p-3 bg-blue-35 rounded-xl cursor-pointer text-center' to='write'>
            <Typography variant='body02' className='text-white'>
              작성
            </Typography>
          </Link>
        </div>
      </div>
      <div className='w-full flex-1 p-3 flex flex-col gap-3'>
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
      className='p-3 flex items-center gap-8 cursor-pointer rounded-lg hover:bg-grey-05'
      to={uuid}
    >
      {thumbnailUrl && <img className='aspect-square max-w-24 rounded-lg' src={thumbnailUrl} />}
      <div className='flex-1 flex flex-col gap-3 items-start'>
        <Typography variant='body02'>{title}</Typography>
        <Typography variant='body03' className='line-clamp-2 break-all'>
          {content}
        </Typography>
      </div>
      <Typography variant='body03' className='text-grey-40'>
        {date.slice(0, 10)}
      </Typography>
    </Link>
  );
};
