import React from 'react';
import Button from '../../../atoms/Button';

interface GenderOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: GenderOption[];
  selected: string;
  onSelect: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}
const GenderSelector = ({ options, selected, onSelect }: Props) => (
  <div>
    <div className='flex items-center gap-4 md:gap-6 mb-3'>
      <label className='text-blue-10 text-md md:text-xl font-semibold w-16 md:w-auto'>성별</label>
      <hr className='w-[381px] border-t-2 border-blue-10 rounded-xl' />
    </div>
    <div className='flex justify-center gap-4'>
      {options.map((g) => (
        <Button
          type='button'
          key={g.value}
          size='sm'
          variant={selected === g.value ? 'main' : 'greyLight'}
          shape='rounded'
          fullWidth={false}
          onClick={() => onSelect(g.value)}
          className='w-16 h-10 md:w-[120px] md:h-[48px]'
          disabled={false}
        >
          {g.label}
        </Button>
      ))}
    </div>
  </div>
);

export default GenderSelector;
