/**
 * 게시글 생성일을 받아서 “n분 전”, “n시간 전” 등의 문자열을 반환합니다.
 * @param {string} dateString ISO 8601 형식의 날짜 문자열, 예: "2025-04-08T23:10:02.1956"
 * @returns {string} 상대 시간 문자열
 */

export function getTimeElapsed(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) {
        return '방금 전';
    }

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
        return `${diffMin}분 전`;
    }

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
        return `${diffHour}시간 전`;
    }

    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) {
        return `${diffDay}일 전`;
    }

    if (diffDay < 365) {
        const diffMonth = Math.floor(diffDay / 30);
        return `${diffMonth}개월 전`;
    }

    const diffYear = Math.floor(diffDay / 365);
    return `${diffYear}년 전`;
}
