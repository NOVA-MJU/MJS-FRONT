export interface BroadcastContent {
  title: string;
  url: string;
  thumbnailUrl: string;
  playlistTitle: string;
  publishedAt: string; // ISO 형식의 날짜 문자열
}

export interface BroadcastData {
  content: BroadcastContent[];
}

export interface BroadcastResponse {
  status: string;
  data: BroadcastData;
  timestamp: string;
}
