import { Pageable } from './notionInfo';
export interface NoticeItem {
  title: string;
  date: string;
  category: 'general' | 'academic' | 'scholarship' | 'career' | 'activity' | 'rule';
  link: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface NoticeResponse {
  content: NoticeItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
