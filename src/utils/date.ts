/**
 * 현재 클라이언트 기준 시간으로 UTC 시간 응답값을 날짜-시간 형식으로 파싱합니다.
 * @param dateString 서버에서 응답받은 현재 시간을 입력하세요.
 * @returns `2025-08-09 17:17`
 */
export const formatToLocalTime = (dateString: string): string => {
  const date = new Date(dateString + 'Z');

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 현재 클라이언트 기준 시간으로 UTC 시간 응답값을 날짜 형식으로 파싱합니다.
 * @param dateString 서버에서 응답받은 현재 시간을 입력하세요.
 * @returns `2025-08-09`
 */
export const formatToLocalDate = (dateString: string): string => {
  const date = new Date(dateString + 'Z');

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 현재 클라이언트 기준 시간으로 UTC 시간 응답값으로부터 경과시간을 파싱합니다.
 * @param dateString 서버에서 응답받은 현재 시간을 입력하세요.
 * @returns `3분 전`
 */
export const formatToElapsedTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString + 'Z');
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const MONTH = DAY * 30;
  const YEAR = DAY * 365;

  if (diffInSeconds < 30) {
    return '방금 전';
  }
  if (diffInSeconds < MINUTE) {
    return `${diffInSeconds}초 전`;
  }
  if (diffInSeconds < HOUR) {
    return `${Math.floor(diffInSeconds / MINUTE)}분 전`;
  }
  if (diffInSeconds < DAY) {
    return `${Math.floor(diffInSeconds / HOUR)}시간 전`;
  }
  if (diffInSeconds < MONTH) {
    return `${Math.floor(diffInSeconds / DAY)}일 전`;
  }
  if (diffInSeconds < YEAR) {
    return `${Math.floor(diffInSeconds / MONTH)}달 전`;
  }
  return `${Math.floor(diffInSeconds / YEAR)}년 전`;
};
