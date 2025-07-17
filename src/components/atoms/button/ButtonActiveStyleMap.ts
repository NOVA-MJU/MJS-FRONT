import { colors } from '../../../styles/color';

const variantStyleMap: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: colors.mju_primary,
    color: colors.white,
  },
  sub: {
    backgroundColor: '#FFD700',
    color: colors.mju_primary,
  },
  basic: {
    backgroundColor: colors.blue20,
    color: colors.white,
  },
  blue35: {
    backgroundColor: colors.blue35,
    color: colors.white,
  },
  danger: {
    backgroundColor: colors.error,
    color: colors.white,
  },
  chip: {
    backgroundColor: colors.grey02,
    color: colors.black,
  },
  grey: {
    backgroundColor: colors.grey40,
    color: colors.white,
  },
  greyLight: {
    backgroundColor: '#E3E6E6',
    color: '#999999',
  },
  borderRed: {
    backgroundColor: 'transparent',
    color: colors.error,
    border: `2px solid ${colors.error}`,
  },
};

export default variantStyleMap;
