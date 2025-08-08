export interface BroadcastContent {
  title: string;
  url: string;
  thumbnailUrl: string;
  playlistTitle: string | null;
  publishedAt: string; // ISO 형식
}

export interface SortInfo {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface BroadcastData {
  content: BroadcastContent[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface BroadcastResponse {
  status: string;
  data: BroadcastData;
  timestamp: string;
}
