import React from 'react';
import Button from '../../../atoms/button';

interface Props {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}

const GenderSelector: React.FC<Props> = ({ options, selected, onSelect }) => (
  <div>
    <div className='flex items-center gap-24 mb-3'>
      <label className='text-blue-10 text-xl font-semibold'>성별</label>
      <hr className='w-[306px] border-t-2 border-blue-10 rounded-xl' />
    </div>
    <div className='flex justify-center gap-4'>
      {options.map((g) => (
        <Button
          key={g}
          variant={selected === g ? 'main' : 'greyLight'}
          shape='rounded'
          fullWidth={false}
          onClick={() => onSelect(g)}
          className='w-[120px] h-[48px]'
          disabled={false}
        >
          {g}
        </Button>
      ))}
    </div>
  </div>
);

export default GenderSelector;
