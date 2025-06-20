

export type ButtonVariant = 'main'|'sub'| 'basic'| 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant ?: ButtonVariant
}