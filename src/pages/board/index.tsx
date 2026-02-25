import { useEffect, useState } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();

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

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    navigate('/board/write');
  };

  const BoardContent = (
    <>
      <header className='flex flex-col gap-4'>
        <h2 className='text-title01 text-blue-35'>게시판</h2>
        <div className={clsx('flex flex-col gap-3', isDesktop && 'flex-row items-center gap-4')}>
          <div className={clsx(isDesktop && 'flex-1')}>
            <SearchBar />
          </div>
          {isDesktop && (
            <button
              type='button'
              onClick={handleWriteClick}
              className='bg-blue-35 text-body02 hover:bg-blue-30 h-12 rounded-xl px-6 font-semibold text-white transition-colors'
            >
              글 남기기
            </button>
          )}
        </div>
        <nav className='border-grey-10 grid w-full grid-cols-2 border-b'>
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              className={clsx(
                'text-body02 md:text-body01 relative py-3 text-center transition-colors',
                category === tab.key ? 'text-blue-20 font-semibold' : 'text-grey-30',
              )}
              onClick={() => setCategory(tab.key)}
            >
              {tab.label}
              <span
                className={clsx(
                  'absolute bottom-0 left-0 h-[3px] w-full rounded-full',
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
          <div className='text-body02 text-grey-30 flex h-full w-full items-center justify-center'>
            게시글을 불러오는 데 실패했습니다.
          </div>
        ) : contents.length === 0 ? (
          <div className='text-body02 text-grey-30 flex h-full w-full items-center justify-center'>
            게시글이 없습니다.
          </div>
        ) : (
          <div className='divide-grey-05 flex h-full flex-col divide-y overflow-y-auto'>
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
      <div className='bg-grey-00 relative flex w-full flex-col items-center pb-24 md:pb-12'>
        <div className='flex w-[1200px] flex-col gap-6 p-8'>{BoardContent}</div>
      </div>
    );

  return (
    <div className='bg-grey-00 relative flex h-full w-full flex-col pb-24 md:pb-12'>
      <div className='flex flex-1 flex-col gap-6 p-4 md:p-8'>{BoardContent}</div>

      {location.pathname === '/board' && (
        <button
          type='button'
          className='bg-blue-35 fixed right-5 bottom-40 flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 rounded-full text-white shadow-lg md:bottom-16'
          onClick={handleWriteClick}
        >
          <HiOutlinePencilSquare size={22} />
          <span className='text-caption01 font-semibold'>글남기기</span>
        </button>
      )}
    </div>
  );
}

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
      className='hover:bg-blue-05/40 flex cursor-pointer px-5 py-6 transition-colors'
      to={`/board/${uuid}`}
    >
      <div
        className={clsx(
          'flex flex-1 flex-col gap-2',
          isPopular && 'border-blue-05 border-l-2 pl-4',
        )}
      >
        <Typography variant='body02' className='text-grey-90 font-semibold'>
          {title}
        </Typography>
        <Typography variant='body03' className='text-grey-40 line-clamp-2'>
          {previewContent}
        </Typography>
        <div className='text-caption01 text-grey-30 flex items-center gap-4'>
          <span className='text-blue-20 flex items-center gap-1'>
            <IoHeartOutline />
            <span className='text-grey-40'>{likeCount}</span>
          </span>
          <span className='text-blue-20 flex items-center gap-1'>
            <IoChatbubbleEllipsesOutline />
            <span className='text-grey-40'>{commentCount}</span>
          </span>
        </div>
      </div>
      <div className='flex min-w-[70px] items-center justify-center'>
        <Typography variant='caption01' className='text-grey-30 font-normal'>
          {formatToElapsedTime(publishedAt)}
        </Typography>
      </div>
    </Link>
  );
}
