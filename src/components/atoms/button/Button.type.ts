export type ButtonVariant = 'main' | 'sub' | 'basic' | 'danger' | 'grey' | 'greyLight';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'pill' | 'rounded';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled: boolean;
  fullWidth: boolean;
}
