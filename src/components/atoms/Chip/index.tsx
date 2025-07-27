import clsx from 'clsx';
import { Typography } from '../Typography';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  selected?: boolean;
  primary?: boolean;
}

export default function Chip({
  text,
  selected = false,
  primary = false,
  className,
  ...props
}: ChipProps) {
  return (
    <button
      {...props}
      className={clsx(
        'h-12 px-6 rounded-full cursor-pointer',
        selected ? 'bg-mju-primary text-white' : 'bg-grey-05 hover:bg-blue-05',
        primary && 'w-46',
        className,
      )}
    >
      <Typography variant='body03'>{text}</Typography>
    </button>
  );
}
