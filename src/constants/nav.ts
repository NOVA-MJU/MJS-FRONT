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
    key: 'msi',
    label: 'MSI',
    href: 'https://sso1.mju.ac.kr/login.do?redirect_uri=https://msi.mju.ac.kr/index_Myiweb.jsp',
  },
  {
    key: 'myicap',
    label: 'MYiCap',
    href: 'https://myicap.mju.ac.kr/site/main/index001?prevurl=https%3A%2F%2Fmyicap.mju.ac.kr%2F',
  },
];
