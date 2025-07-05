import { useEffect, useState } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/molecules/common/Pagination';

export default function Board() {
  const navigate = useNavigate();
  const [contents] = useState(dummyPost);
  const [, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages] = useState(10);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        // const response = await getBoardContents(page, size);
        // console.log(response.data.content);
        // setContents(response.data.content);
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
        <button>
          <Typography variant='body02'>글 남기기</Typography>
        </button>
      </div>
      <div className='flex flex-col p-3 gap-3'>
        {contents.map((content) => (
          <div
            key={content.id}
            className='p-3 flex cursor-pointer'
            onClick={() => navigate(`/board/${content.id}`)}
          >
            <div className='flex-1 flex flex-col gap-3'>
              <Typography variant='body02'>{content.title}</Typography>
              <Typography variant='body03'>{content.content}</Typography>
              <div className='flex items-center'>
                <Typography variant='body03' className='text-grey-40'>
                  ☒ {content.viewCount} | ☒ {content.commentCount}
                </Typography>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <Typography variant='body03' className='text-grey-40'>
                {content.date}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={(next) => setPage(next)} />
    </div>
  );
}

interface Post {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  date: string;
}

const dummyPost: Post[] = [
  {
    id: 1,
    title: '첫 번째 자유게시판 글',
    content:
      '어쩌구저쩌구 게시판 설명이 이곳에 들어갑니다. 어쩌구저쩌구 게시판 설명이 이곳에 들어갑니다.',
    viewCount: 42,
    commentCount: 3,
    date: '2025.06.23',
  },
  {
    id: 2,
    title: '두 번째 자유게시판 글',
    content: '여기에 게시글 내용의 요약본이 표시됩니다. 내용을 간략히 확인할 수 있어요.',
    viewCount: 18,
    commentCount: 0,
    date: '2025.06.22',
  },
  {
    id: 3,
    title: '세 번째 자유게시판 글',
    content: '샘플 텍스트로 구성된 게시글 예시입니다. 반복되는 텍스트를 사용해 보세요.',
    viewCount: 87,
    commentCount: 12,
    date: '2025.06.21',
  },
  {
    id: 4,
    title: '네 번째 자유게시판 글',
    content: '이것은 네 번째 예제 게시글의 내용 미리보기입니다. 간단히 설명합니다.',
    viewCount: 5,
    commentCount: 1,
    date: '2025.06.20',
  },
  {
    id: 5,
    title: '다섯 번째 자유게시판 글',
    content: '마지막 예제 게시글입니다. 자유롭게 작성해 보세요.',
    viewCount: 130,
    commentCount: 25,
    date: '2025.06.19',
  },
  {
    id: 6,
    title: '여섯 번째 자유게시판 글',
    content: '새롭게 추가된 여섯 번째 예제 게시글입니다. 자유롭게 의견을 남겨보세요.',
    viewCount: 65,
    commentCount: 7,
    date: '2025.06.18',
  },
  {
    id: 7,
    title: '일곱 번째 자유게시판 글',
    content: '일곱 번째 게시글입니다. 다양한 주제로 토론을 이어가보세요.',
    viewCount: 23,
    commentCount: 2,
    date: '2025.06.17',
  },
  {
    id: 8,
    title: '여덟 번째 자유게시판 글',
    content: '여덟 번째 예시입니다. 자유롭게 작성해 주세요.',
    viewCount: 109,
    commentCount: 14,
    date: '2025.06.16',
  },
  {
    id: 9,
    title: '아홉 번째 자유게시판 글',
    content: '아홉 번째 게시글 미리보기입니다. 여러분의 생각을 공유해 주세요.',
    viewCount: 34,
    commentCount: 4,
    date: '2025.06.15',
  },
  {
    id: 10,
    title: '열 번째 자유게시판 글',
    content: '열 번째 예제 게시글이에요. 마무리 테스트용입니다.',
    viewCount: 50,
    commentCount: 5,
    date: '2025.06.14',
  },
];
