'use client';
interface MealComponentProps {
  title: '아침' | '점심' | '저녁';
  items: string[];
  highlight: boolean; //아침 점심 저녁 중 해당 시간대에는 highlight.
}
const MealComponent = ({ title, items, highlight }: MealComponentProps) => {
  return (
    <div
      className={`rounded-xl border ${highlight ? 'bg-grey-20' : 'bg-white'} shadow-sm w-full max-w-xs`}
    >
      <div className='border-b px-4 py-2'>
        <h2 className='text-sm font-semibold text-blue-600'>{title}</h2>
      </div>
      <ul className='px-4 py-2 text-sm text-gray-800 space-y-1'>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default MealComponent;
