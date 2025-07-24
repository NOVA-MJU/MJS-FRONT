import { useEffect, useState } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/molecules/common/Pagination';
import { getBoards, type BoardItem } from '../../api/board';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import Divider from '../../components/atoms/Divider';

export default function Board() {
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * 게시글 목록 로드
   */
  useEffect(() => {
    const p = parseInt(searchParams.get('page') ?? '0', 10);
    if (p !== page) {
      setPage(p);
    }

    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await getBoards(p, size);
        console.log(response);
        setContents(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        // TODO 권한 오류 발생 시 로그인 페이지로 이동하도록 해야함
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [searchParams, size]);

  return (
    <div className='w-full h-full px-9 py-12 flex flex-col gap-6'>
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
          className='inline-flex items-center justify-center gap-[10px] p-3 bg-blue-35 rounded-xl w-46 cursor-pointer'
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
          <div className='flex flex-col px-3  divide-y-2 divide-grey-05'>
            {contents.map((content) => (
              <Link
                key={content.uuid}
                className='px-3 py-6 flex cursor-pointer'
                to={`/board/${content.uuid}`}
              >
                <div className='flex-1 flex flex-col gap-3'>
                  <Typography variant='body02'>{content.title}</Typography>
                  <Typography variant='body03'>{content.previewContent}</Typography>
                  <div className='flex items-center'>
                    <Typography variant='body03' className='text-grey-40'>
                      ☒ {content.likeCount} | ☒ {content.commentCount}
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center justify-center'>
                  <Typography variant='body03' className='text-grey-40'>
                    {content.publishedAt}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(next) => {
              setPage(next);
              setSearchParams({ page: next.toString(), size: size.toString() });
            }}
          />
        </>
      )}
    </div>
  );
}
