import { useEffect, useState } from 'react';
import MyViewLayout from '../../components/templates/MyViewLayout';
// import { getMyPost } from '../../api/mypage'; // 실제 API 사용
import type { Content } from '../../types/mypage/content';
import Demo from '../../constants/demopost';

const ViewPosts: React.FC = () => {
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      // const data = await getMyPost(); // 실제 API
      const data = Demo; // 임시 데모 데이터 사용
      setContentList(data);
    } catch (err) {
      console.error('[mypage mock 오류]', err);
    } finally {
      setLoading(false);
    }
  };

  const paginatedItems = contentList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      {loading ? (
        <p className='text-center mt-20'>로딩 중...</p>
      ) : (
        <div>
          <MyViewLayout
            title='내가 쓴 게시물'
            itemsPerPage={ITEMS_PER_PAGE}
            page={page}
            onChange={setPage}
            totalPages={Math.ceil(contentList.length / ITEMS_PER_PAGE)}
            items={paginatedItems.map((item, index) => ({
              id: 0,
              title: item.title,
              content: item.previewContent,
              date: item.publishedAt.slice(0, 10),
              link: `/post/${item.uuid}`,
              isLast: index === paginatedItems.length - 1,
            }))}
          />
        </div>
      )}
    </>
  );
};

export default ViewPosts;
