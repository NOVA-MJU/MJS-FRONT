import type { Content } from '../types/mypage/content';

const demoPost: Content[] = Array.from({ length: 10 }, (_, i) => ({
  uuid: `831619ee-7588-4a5a-82b4-148d3aeed${310 + i}`,
  title: `자전거 타고 괌 가는 방법 ${i + 1}`,
  previewContent: `본문 전체 내용 일부 프리뷰입니다. (${i + 1})`,
  viewCount: Math.floor(Math.random() * 100),
  published: true,
  publishedAt: `2025-03-${String(9 + i).padStart(2, '0')}T01:16:45.9195322`,
  createdAt: `2025-03-${String(9 + i).padStart(2, '0')}T01:16:45.954082`,
  updatedAt: `2025-03-${String(9 + i).padStart(2, '0')}T01:16:45.954082`,
  likeCount: Math.floor(Math.random() * 10),
  commentCount: Math.floor(Math.random() * 5),
  author: '마루명치',
  liked: Math.random() < 0.5,
}));

export default demoPost;
