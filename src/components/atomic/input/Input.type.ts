export type InputVariant = 'field' | 'searchbar' | 'labelfield';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  value?: string | number;
}
