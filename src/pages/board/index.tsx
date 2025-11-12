import { useEffect, useState } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/molecules/common/Pagination';
import { getBoards, type BoardItem, type Category, type GetBoardsParams } from '../../api/board';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import Divider from '../../components/atoms/Divider';
import { IoHeartOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import clsx from 'clsx';
import { formatToElapsedTime } from '../../utils';
import { useResponsive } from '../../hooks/useResponse';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: 'NOTICE', label: '정보 게시판' },
  { key: 'FREE', label: '자유 게시판' },
];

const PAGE_SIZE = 10;

export default function Board() {
  const [category, setCategory] = useState<Category>('NOTICE');
  const [page, setPage] = useState(0);
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { isDesktop } = useResponsive();
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setPage(0);
  }, [category]);

  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const params: GetBoardsParams = {
          page,
          size: PAGE_SIZE,
          communityCategory: category,
          sortBy: 'createdAt',
          direction: 'DESC',
        };
        const res = await getBoards(params);
        setContents(res.content);
        setTotalPages(res.totalPages);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [category, page]);

  /** -------------------
   *  공통 컨텐츠 블록
   * ------------------- */
  const BoardContent = (
    <>
      <header className='flex flex-col gap-4'>
        <h2 className='text-title01 text-blue-35'>게시판</h2>
        <SearchBar />
        <nav className='grid w-full grid-cols-2 border-b border-grey-10'>
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              className={clsx(
                'relative py-3 text-center text-body02 md:text-body01 transition-colors',
                category === tab.key ? 'text-blue-20 font-semibold' : 'text-grey-30',
              )}
              onClick={() => setCategory(tab.key)}
            >
              {tab.label}
              <span
                className={clsx(
                  'absolute left-0 bottom-0 h-[3px] w-full rounded-full',
                  category === tab.key ? 'bg-blue-20' : 'bg-transparent',
                )}
              />
            </button>
          ))}
        </nav>
      </header>

      <Divider />

      <section className='flex-1 overflow-hidden rounded-xl bg-white shadow-sm'>
        {isLoading ? (
          <div className='flex h-full w-full items-center justify-center'>
            <LoadingIndicator />
          </div>
        ) : isError ? (
          <div className='flex h-full w-full items-center justify-center text-body02 text-grey-30'>
            게시글을 불러오는 데 실패했습니다.
          </div>
        ) : contents.length === 0 ? (
          <div className='flex h-full w-full items-center justify-center text-body02 text-grey-30'>
            게시글이 없습니다.
          </div>
        ) : (
          <div className='flex h-full flex-col divide-y divide-grey-05 overflow-y-auto'>
            {contents.map((content) => (
              <BoardItem
                key={content.uuid}
                uuid={content.uuid}
                title={content.title}
                previewContent={content.previewContent}
                likeCount={content.likeCount}
                commentCount={content.commentCount}
                publishedAt={content.publishedAt}
                isPopular={content.popular}
              />
            ))}
          </div>
        )}
      </section>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
    </>
  );

  /** -------------------
   *  데스크톱 / 모바일 분기
   * ------------------- */
  if (isDesktop)
    return (
      <div className='relative flex flex-col items-center w-full bg-grey-00 pb-24 md:pb-12'>
        <div className='w-[1200px] flex flex-col gap-6 p-8'>{BoardContent}</div>
        <button
          type='button'
          className='fixed bottom-24 right-24 flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-full bg-blue-35 text-white shadow-lg transition-transform hover:scale-105'
          onClick={() => {
            if (!isLoggedIn) {
              toast.error('로그인이 필요한 서비스입니다.');
              navigate('/login');
              return;
            }
            navigate('/board/write');
          }}
        >
          <HiOutlinePencilSquare size={24} />
          <span className='text-caption01 font-semibold'>글남기기</span>
        </button>
      </div>
    );

  // 모바일
  return (
    <div className='relative flex h-full w-full flex-col bg-grey-00 pb-24 md:pb-12'>
      <div className='flex flex-1 flex-col gap-6 p-4 md:p-8'>{BoardContent}</div>

      <button
        type='button'
        className='fixed bottom-40 right-5 flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 rounded-full bg-blue-35 text-white shadow-lg md:bottom-16'
        onClick={() => {
          if (!isLoggedIn) {
            toast.error('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
          }
          navigate('/board/write');
        }}
      >
        <HiOutlinePencilSquare size={22} />
        <span className='text-caption01 font-semibold'>글남기기</span>
      </button>
    </div>
  );
}

/** -------------------
 *  게시글 Item 컴포넌트
 * ------------------- */
interface BoardItemProps {
  uuid: string;
  title: string;
  previewContent: string;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  isPopular: boolean;
}

function BoardItem({
  uuid,
  title,
  previewContent,
  likeCount,
  commentCount,
  publishedAt,
  isPopular,
}: BoardItemProps) {
  return (
    <Link
      className='flex cursor-pointer px-5 py-6 transition-colors hover:bg-blue-05/40'
      to={`/board/${uuid}`}
    >
      <div
        className={clsx(
          'flex flex-1 flex-col gap-2',
          isPopular && 'border-l-2 border-blue-05 pl-4',
        )}
      >
        <Typography variant='body02' className='font-semibold text-grey-90'>
          {title}
        </Typography>
        <Typography variant='body03' className='line-clamp-2 text-grey-40'>
          {previewContent}
        </Typography>
        <div className='flex items-center gap-4 text-caption01 text-grey-30'>
          <span className='flex items-center gap-1 text-blue-20'>
            <IoHeartOutline />
            <span className='text-grey-40'>{likeCount}</span>
          </span>
          <span className='flex items-center gap-1 text-blue-20'>
            <IoChatbubbleEllipsesOutline />
            <span className='text-grey-40'>{commentCount}</span>
          </span>
        </div>
      </div>
      <div className='flex min-w-[70px] items-center justify-center'>
        <Typography variant='caption01' className='text-grey-30'>
          {formatToElapsedTime(publishedAt)}
        </Typography>
      </div>
    </Link>
  );
}
