import React, { useState } from 'react';
import ArrowDown from '../../../../assets/btn_arrow_pub.svg';
import { MAJORS } from '../../../../constants/departments'; // dummy 데이터
import clsx from 'clsx';

interface Props {
  label: string;
  selected: string;
  onSelect: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}

const DropdownField: React.FC<Props> = ({
  label,
  selected,
  onSelect,
  placeholder = '학과',
  error,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='relative w-full h-[90px] flex flex-col gap-2'>
      {/* 라벨 + 라인 */}
      <div className='flex items-center gap-6'>
        <label className='text-blue-10 text-xl font-semibold whitespace-nowrap'>{label}</label>
        <hr className='flex-1 border-t-2 border-blue-10 rounded-xl' />
      </div>

      {/* 선택 박스 */}
      <button
        type='button'
        className={clsx(
          'w-full p-3 rounded-xl outline-2 outline-offset-[-2px] flex justify-between items-center',
          open ? 'outline-blue-20 bg-grey-02' : 'outline-grey-05 bg-white',
        )}
        onClick={() => setOpen(!open)}
      >
        <span className={clsx('text-base', selected ? 'text-black' : 'text-grey-30')}>
          {selected || placeholder}
        </span>
        <img src={ArrowDown} alt='dropdownBtn' className='w-4 h-4' />
      </button>

      {/* 옵션 리스트 */}
      {open && (
        <ul className='absolute top-22 left-0 z-10 mt-1 w-full bg-white rounded-xl shadow max-h-48 overflow-auto'>
          {MAJORS.map((m) => (
            <li
              key={m}
              className='px-4 py-2 hover:bg-blue-10/10 cursor-pointer'
              onClick={() => {
                onSelect(m);
                setOpen(false);
              }}
            >
              {m}
            </li>
          ))}
        </ul>
      )}

      {/* 에러 메시지 공간 확보 (필요 시) */}
      <p className='text-xs mt-2 min-h-[20px] text-red-500'>
        {error ? '학과를 선택해주세요.' : '\u00A0'}
      </p>
    </div>
  );
};

export default DropdownField;
