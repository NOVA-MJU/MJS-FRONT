import type { NavItem } from '../types/nav/item';

export const NAV_ITEMS: NavItem[] = [
  { key: 'notice', label: '공지사항', path: '/notice' },
  { key: 'department', label: '학과별정보', path: '/department' },
  { key: 'board', label: '게시판', path: '/board' },
  { key: 'meal', label: '식단', path: '/menu' },
  { key: 'calendar', label: '학사일정', path: '/academic-calendar' },
  {
    key: 'mentor',
    label: '멘토관 서비스',
    href: 'https://v0-university-career-data-platform.vercel.app/',
  },
  {
    key: 'wiki',
    label: '띵지위키',
    href: 'https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90',
  },
  {
    key: 'sso',
    label: 'SSO',
    href: 'https://sso.mju.ac.kr/sso/auth?response_type=code&client_id=lms&state=Random%20String&redirect_uri=https://lms.mju.ac.kr/ilos/sso/sso_response.jsp',
  },
];
