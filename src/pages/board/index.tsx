import { useEffect, useRef, useState } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../components/molecules/common/Pagination';
import { getBoards, type BoardItem } from '../../api/board';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import Divider from '../../components/atoms/Divider';
import { IoIosChatbubbles, IoIosHeart } from 'react-icons/io';
import { RxDividerVertical } from 'react-icons/rx';
import { formatToElapsedTime } from '../../utils';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

export default function Board() {
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const initializedRef = useRef(false);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 로그인이 되어있지 않은 경우 튕겨냄
   */
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/', { replace: true, state: { from: location.pathname } });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  /**
   * 페이지네이션 초기화
   */
  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const res = await getBoards(0);
        setContents(res.content);
        setTotalPages(res.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
        initializedRef.current = true;
      }
    })();
  }, []);

  /**
   * 페이지네이션 게시글 목록 로드
   */
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getBoards(page);
        setContents(res.content);
        if (page === 0) setTotalPages(res.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page]);

  return (
    <div className='w-full h-full p-4 md:p-8 flex flex-col gap-4 md:gap-6'>
      <div>
        <Typography variant='heading01' className='text-mju-primary'>
          자유게시판
        </Typography>
      </div>
      <div>
        <SearchBar />
      </div>
      <Divider />
      <div className='flex justify-end'>
        <Link
          className='inline-flex items-center justify-center gap-[10px] p-3 bg-blue-35 rounded-xl m-w-24 md:w-46 cursor-pointer'
          to={'/board/write'}
        >
          <Typography variant='body02' className='text-white'>
            글 남기기
          </Typography>
        </Link>
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center h-screen'>
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <div className='flex flex-col px-1 md:px-3  divide-y-2 divide-grey-05'>
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
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
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
    <Link className='px-3 py-6 flex cursor-pointer' to={`/board/${uuid}`}>
      <div
        className={clsx(
          'flex-1 flex flex-col gap-1 md:gap-3',
          isPopular && 'pl-4 border-l-2 border-blue-10',
        )}
      >
        <Typography variant='body02'>{title}</Typography>
        <Typography variant='body03' className='line-clamp-1 md:line-clamp-2'>
          {previewContent}
        </Typography>
        <div className='flex items-center'>
          <Typography variant='body03' className='text-grey-40 flex gap-1 items-center'>
            <IoIosHeart />
            {likeCount}
            <RxDividerVertical />
            <IoIosChatbubbles />
            {commentCount}
          </Typography>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <Typography variant='body03' className='text-grey-40'>
          {formatToElapsedTime(publishedAt)}
        </Typography>
      </div>
    </Link>
  );
}
