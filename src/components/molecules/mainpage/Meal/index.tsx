'use client';
interface MealComponentProps {
  title: '아침' | '점심' | '저녁';
  items: string[];
  highlight: boolean; //아침 점심 저녁 중 해당 시간대에는 highlight.
}
const MealComponent = ({ title, items, highlight }: MealComponentProps) => {
  return (
    <div
      className={` border-grey-20 rounded  ${highlight ? 'bg-white ' : 'bg-white'} shadow-sm w-full `}
    >
      <div className='px-4 py-2'>
        <h2
          className={`text-sm  ${highlight ? 'text-blue-35 ' : 'text-blue-10'} font-semibold text-black`}
        >
          {title}
        </h2>
      </div>
      <ul className='px-4 py-2 text-sm text-black-40 space-y-1'>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default MealComponent;
