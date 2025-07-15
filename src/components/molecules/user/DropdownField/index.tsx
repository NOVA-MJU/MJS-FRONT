import React, { useState } from 'react';
import ArrowDown from '../../../../assets/btn_arrow_pub.svg';
import { DEPARTMENT_OPTIONS } from '../../../../constants/departments'; // enum 리스트
import clsx from 'clsx';

interface Props {
  label: string;
  selected: string;
  onSelect: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  options: { label: string; value: string }[];
}

const DropdownField: React.FC<Props> = ({
  label,
  selected,
  onSelect,
  placeholder = '학과',
  error,
  options,
}) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((item) => item.value === selected)?.label;
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
        <span className={clsx('text-base', selected ? 'text-grey-40' : 'text-grey-20')}>
          {selectedLabel || placeholder}
        </span>
        <img src={ArrowDown} alt='dropdownBtn' className='w-4 h-4' />
      </button>

      {/* 옵션 리스트 */}
      {open && (
        <ul className='absolute top-22 left-0 z-10 mt-1 w-full bg-white rounded-xl shadow max-h-48 overflow-auto text-grey-40'>
          {DEPARTMENT_OPTIONS.map((item) => (
            <li
              key={item.value}
              className='px-4 py-2 hover:bg-blue-10/10 cursor-pointer'
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >
              {item.label}
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
