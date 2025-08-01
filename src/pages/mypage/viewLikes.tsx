import { useEffect, useState } from 'react';
import MyViewLayout from '../../components/templates/MyViewLayout';
import likedPostsDemo from '../../constants/demo-likes';
import type { Content } from '../../types/mypage/content';

const ViewLikedPosts: React.FC = () => {
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
      const data = likedPostsDemo.data;
      setContentList(data);
    } catch (err) {
      console.error('[liked posts mock 오류]', err);
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
            title='찜한 게시물'
            itemsPerPage={ITEMS_PER_PAGE}
            page={page}
            onChange={setPage}
            totalPages={Math.ceil(contentList.length / ITEMS_PER_PAGE)}
            items={paginatedItems.map((item, index) => ({
              id: (page - 1) * ITEMS_PER_PAGE + index + 1,
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

export default ViewLikedPosts;
