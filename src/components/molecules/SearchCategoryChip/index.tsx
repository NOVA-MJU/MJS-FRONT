import clsx from 'clsx';
import { Typography } from '../../atoms/Typography';

interface SearchCategoryChipProps {
  text: string;
  selected?: boolean;
  primary?: boolean;
}

export default function SearchCategoryChip({
  text,
  selected = false,
  primary = false,
}: SearchCategoryChipProps) {
  return (
    <button
      className={clsx(
        'h-12 px-6 rounded-full cursor-pointer',
        selected ? 'bg-mju-primary text-white' : 'bg-grey-05 hover:bg-blue-05',
        primary && 'w-46',
      )}
    >
      <Typography variant='body03'>{text}</Typography>
    </button>
  );
}
