/**
 * 콘텐츠 로딩 중에 표시되는 UI 입니다
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`min-h-5 animate-pulse rounded-md bg-grey-05 ${className}`} {...props} />;
}

export { Skeleton };
