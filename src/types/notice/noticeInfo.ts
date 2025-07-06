export interface NoticeItem {
  category: 'general' | 'academic' | 'scholarship' | 'career' | 'activity' | 'rule';
  date: string;
  link: string;
  title: string;
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
