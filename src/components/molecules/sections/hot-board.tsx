import { type BoardItem, getBoards } from '@/api/board';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HotBoardList() {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [boards, setBoards] = useState<BoardItem[]>([]);

  /**
   * 데이터 불러오기
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 게시판 데이터 요청
   */
  async function fetchData() {
    try {
      setIsLoading(true);
      const res = await getBoards({ communityCategory: 'FREE' });
      setBoards(res.content);
      setIsError(false);
    } catch (e) {
      console.error('HotBoardList.tsx::fetchData()', e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <h2 className='text-title02 text-mju-primary'>자유게시판</h2>
        </div>
        <div className='p-3 flex flex-col gap-2 border-2 border-grey-05 rounded-xl'>
          {isError && (
            <div className='py-4 flex flex-col gap-3 items-center'>
              <p className='text-body02'>문제가 발생했습니다</p>
              <button
                className='bg-grey-05 px-2 py-1 cursor-pointer rounded-xl text-caption01'
                onClick={fetchData}
              >
                다시 시도하기
              </button>
            </div>
          )}
          {isLoading && [...Array(5)].map((_, index) => <Skeleton key={index} className='h-10' />)}
          {!isLoading &&
            boards &&
            boards
              .slice(0, 5)
              .map((board) => (
                <BoardItem
                  key={board.uuid}
                  uuid={board.uuid}
                  title={board.title}
                  isHighlighted={board.popular}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 게시판 아이템 항목
 */
interface BoardItemProps {
  uuid: string;
  title: string;
  isHighlighted: boolean;
}

function BoardItem({ uuid, title, isHighlighted }: BoardItemProps) {
  return (
    <Link to={`/board/${uuid}`}>
      <div className='px-3 py-2 flex items-center gap-3 rounded-xl hover:bg-blue-05 transition'>
        {isHighlighted && (
          <div className='px-3 py-2 text-center bg-mju-primary rounded-full'>
            <p className='text-caption01 text-white'>HOT</p>
          </div>
        )}
        <p className='text-body03 line-clamp-1'>{title}</p>
      </div>
    </Link>
  );
}
