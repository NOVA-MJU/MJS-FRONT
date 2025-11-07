function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        flex flex-col gap-4 bg-white rounded-xl p-5
        ${className}
    `}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        flex justify-between items-center
        ${className}
    `}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader };
