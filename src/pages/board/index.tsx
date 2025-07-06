import { useEffect, useState } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/molecules/common/Pagination';
import { getBoards, type BoardItem } from '../../api/board';

export default function Board() {
  const navigate = useNavigate();
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await getBoards(page, size);

        /**
         * response data binding
         */
        console.log(response);
        setContents(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [page, size]);

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
      <hr className='w-full h-[4px] bg-gradient-to-r from-blue-05 to-white rounded-full border-0' />
      <div className='flex justify-end'>
        <button
          className='gap-[10px] p-3 bg-blue-35 rounded-xl w-46 cursor-pointer'
          onClick={() => navigate('write')}
        >
          <Typography variant='body02' className='text-white'>
            글 남기기
          </Typography>
        </button>
      </div>
      <div className='flex flex-col p-3 gap-3'>
        {contents.map((content) => (
          <div
            key={content.uuid}
            className='p-3 flex cursor-pointer'
            onClick={() => navigate(`/board/${content.uuid}`)}
          >
            <div className='flex-1 flex flex-col gap-3'>
              <Typography variant='body02'>{content.title}</Typography>
              <Typography variant='body03'>{content.previewContent}</Typography>
              <div className='flex items-center'>
                <Typography variant='body03' className='text-grey-40'>
                  ☒ {content.viewCount} | ☒ {content.commentCount}
                </Typography>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <Typography variant='body03' className='text-grey-40'>
                {content.publishedAt}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page + 1} totalPages={totalPages} onChange={(next) => setPage(next)} />
    </div>
  );
}
