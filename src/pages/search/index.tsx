import Divider from '../../components/atoms/Divider';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import SearchResultItem from '../../components/molecules/SearchResultItem';
import Chip from '../../components/atoms/Chip';
import { useEffect, useState } from 'react';
import { getSearchOverview, type SearchResultItemRes } from '../../api/search';

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [noticeItems, setNoticeItems] = useState<SearchResultItemRes[]>([]);
  const [boardItems, setBoardItems] = useState<SearchResultItemRes[]>([]);
  const [newsItems, setNewsItems] = useState<SearchResultItemRes[]>([]);

  /**
   * 검색어 입력 후 enter 버튼 클릭 시 handler
   */
  async function handleSubmit(text: string) {
    // TODO 검색 api를 연결합니다
    console.log(text);
    try {
      const res = await getSearchOverview(text);
      setNoticeItems(res.notice);
      setBoardItems(res.community);
      setNewsItems(res.news);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 검색어 자동 완성 handler
   */
  useEffect(() => {
    // TODO 자동완성 api를 연결합니다
  }, [searchText]);

  return (
    <div className='py-12 px-7 flex flex-col gap-12'>
      <SearchBar
        placeholder='검색어를 입력하세요'
        onTextChange={setSearchText}
        onSubmit={handleSubmit}
      />
      <div className='flex gap-6'>
        <Chip text='전체' selected primary />
        <Chip text='공지사항' />
        <Chip text='명대신문' />
        <Chip text='자유게시판' />
        <Chip text='제휴' />
        <Chip text='취업후기' />
      </div>
      <Divider variant='default' />
      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            공지사항
          </Typography>
        </div>
        <div className='border-2 border-grey-05 rounded-xl flex flex-col p-3 gap-3'>
          {noticeItems.map((notice, idx) => (
            <>
              <SearchResultItem
                key={notice.id}
                variant='notice'
                category={notice.category}
                title={notice.highlightedTitle}
                link={notice.link}
              />
              {idx < noticeItems.length - 1 && <Divider variant='thin' />}
            </>
          ))}
          {noticeItems.length === 0 && (
            <div className='min-h-20 flex justify-center items-center'>
              <Typography>검색 결과가 없습니다</Typography>
            </div>
          )}
        </div>
        {noticeItems.length === 5 && (
          <div className='px-14 gap-6 flex items-center'>
            <Divider variant='thin' className='flex-1' />
            <button className='w-46 h-12 p-3 gap-2.5 bg-grey-05 rounded-xl cursor-pointer'>
              <Typography variant='body03'>더보기</Typography>
            </button>
            <Divider variant='thin' className='flex-1' />
          </div>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            자유게시판
          </Typography>
        </div>
        <div className='border-2 border-grey-05 rounded-xl flex flex-col p-3 gap-3'>
          {boardItems.map((board, idx) => (
            <>
              <SearchResultItem
                key={board.id}
                variant='community'
                category={board.category}
                imageUrl={board.imageUrl}
                title={board.highlightedTitle}
                link={board.link}
              />
              {idx < boardItems.length - 1 && <Divider variant='thin' />}
            </>
          ))}
          {boardItems.length === 0 && (
            <div className='min-h-20 flex justify-center items-center'>
              <Typography>검색 결과가 없습니다</Typography>
            </div>
          )}
        </div>
        {boardItems.length === 5 && (
          <div className='px-14 gap-6 flex items-center'>
            <Divider variant='thin' className='flex-1' />
            <button className='w-46 h-12 p-3 gap-2.5 bg-grey-05 rounded-xl cursor-pointer'>
              <Typography variant='body03'>더보기</Typography>
            </button>
            <Divider variant='thin' className='flex-1' />
          </div>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            명대신문
          </Typography>
        </div>
        <div className='border-2 border-grey-05 rounded-xl flex flex-col p-3 gap-3'>
          {newsItems.map((news, idx) => (
            <>
              <SearchResultItem
                key={news.id}
                variant='news'
                imageUrl={news.imageUrl}
                category={news.category}
                title={news.highlightedTitle}
                content={news.highlightedContent}
                link={news.link}
              />
              {idx < newsItems.length - 1 && <Divider variant='thin' />}
            </>
          ))}
          {newsItems.length === 0 && (
            <div className='min-h-20 flex justify-center items-center'>
              <Typography>검색 결과가 없습니다</Typography>
            </div>
          )}
        </div>
        {newsItems.length === 5 && (
          <div className='px-14 gap-6 flex items-center'>
            <Divider variant='thin' className='flex-1' />
            <button className='w-46 h-12 p-3 gap-2.5 bg-grey-05 rounded-xl cursor-pointer'>
              <Typography variant='body03'>더보기</Typography>
            </button>
            <Divider variant='thin' className='flex-1' />
          </div>
        )}
      </div>
    </div>
  );
}
