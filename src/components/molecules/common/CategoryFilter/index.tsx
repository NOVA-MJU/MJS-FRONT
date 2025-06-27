import React from 'react';
import Button from '../../../atoms/button';

export interface CategoryFilterProps {
  categories: string[];
  current: string;
  onChange: (c: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, current, onChange }) => (
  <div className='flex flex-wrap gap-2'>
    {categories.map((c) => (
      <Button
        key={c}
        variant={current === c ? 'main' : 'greyLight'}
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

export default CategoryFilter;
