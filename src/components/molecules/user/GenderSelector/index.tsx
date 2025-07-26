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
const GenderSelector: React.FC<Props> = ({ options, selected, onSelect }) => (
  <div>
    <div className='flex items-center gap-6 mb-3'>
      <label className='text-blue-10 text-xl font-semibold'>성별</label>
      <hr className='w-[381px] border-t-2 border-blue-10 rounded-xl' />
    </div>
    <div className='flex justify-center gap-4'>
      {options.map((g) => (
        <Button
          type='button'
          key={g.value}
          variant={selected === g.value ? 'main' : 'greyLight'}
          shape='rounded'
          fullWidth={false}
          onClick={() => onSelect(g.value)}
          className='w-[120px] h-[48px]'
          disabled={false}
        >
          {g.label}
        </Button>
      ))}
    </div>
  </div>
);

export default GenderSelector;
