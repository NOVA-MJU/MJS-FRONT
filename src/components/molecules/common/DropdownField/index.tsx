import { useState } from 'react';
import ArrowDown from '../../../../assets/btn_arrow_pub.svg';
import clsx from 'clsx';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selected: string;
  onSelect: (v: string) => void;
  options: Option[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
}

const DropdownField = ({
  label,
  selected,
  onSelect,
  options,
  placeholder = '선택하세요',
  error = false,
  errorMessage = '값을 선택해주세요.',
}: Props) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((item) => item.value === selected)?.label;

  return (
    <div className='relative w-full h-[90px] flex flex-col gap-2'>
      <div className='flex items-center gap-6'>
        <label className='text-blue-10 text-md md:text-xl font-semibold whitespace-nowrap'>
          {label}
        </label>
        <hr className='flex-1 border-t-2 border-blue-10 rounded-xl' />
      </div>

      <button
        type='button'
        className={clsx(
          'w-full p-3 rounded-xl outline-2 outline-offset-[-2px] flex justify-between items-center',
          open ? 'outline-blue-20 bg-grey-02' : 'outline-grey-05 bg-white',
        )}
        onClick={() => setOpen(!open)}
      >
        <span className={clsx('text-sm md:text-base', selected ? 'text-grey-40' : 'text-grey-20')}>
          {selectedLabel || placeholder}
        </span>
        <img src={ArrowDown} alt='dropdownBtn' className='w-4 h-4' />
      </button>

      {open && (
        <ul className='absolute text-sm md:text-base top-22 left-0 z-10 mt-1 w-full bg-white rounded-xl shadow max-h-48 overflow-auto text-grey-40'>
          {options.map((item) => (
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

      <p className='text-xs mt-2 min-h-[20px] text-red-500'>{error ? errorMessage : '\u00A0'}</p>
    </div>
  );
};

export default DropdownField;
