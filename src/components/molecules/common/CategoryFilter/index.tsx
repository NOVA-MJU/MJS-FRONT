import React from 'react';
import Button from '../../../atoms/Button';
import { useResponsive } from '@/hooks/useResponse';

export interface CategoryFilterProps {
  categories: string[];
  current: string;
  onChange: (c: string) => void;
}

const CategoryFilter = ({ categories, current, onChange }: CategoryFilterProps) => {
  const { isDesktop } = useResponsive();

  if (!isDesktop) {
    return (
      <div className='md:hidden flex flex-wrap gap-2'>
        {categories.map((c) => (
          <Button
            key={c}
            variant={current === c ? 'blue35' : 'borderGrey'}
            shape='pill'
            size='sm'
            disabled={false}
            fullWidth={false}
            onClick={() => onChange(c)}
          >
            {c}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className='hidden md:flex flex-wrap gap-2'>
      {categories.map((c) => (
        <Button
          key={c}
          variant={current === c ? 'blue35' : 'borderGrey'}
          shape='pill'
          size='md'
          disabled={false}
          fullWidth={false}
          onClick={() => onChange(c)}
        >
          {c}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
