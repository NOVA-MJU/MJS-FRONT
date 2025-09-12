type Props = {
  title: string;
  items: string[];
  highlight?: boolean;
};

export default function MealComponent({ title, items, highlight }: Props) {
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <div className='rounded-2xl border border-slate-200 p-4 md:p-6'>
      <h3
        className={`mb-3 text-base md:text-lg font-semibold ${
          highlight ? 'text-blue-20' : 'text-slate-700'
        }`}
      >
        {title}
      </h3>

      <div className='h-px bg-slate-200 mb-4' />

      {/* 모바일 1열, md부터 2열 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2'>
        <ul className='space-y-2'>
          {left.map((m, i) => (
            <li key={`l-${i}`} className='text-slate-800'>
              {m}
            </li>
          ))}
        </ul>
        <ul className='space-y-2'>
          {right.map((m, i) => (
            <li key={`r-${i}`} className='text-slate-800'>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
