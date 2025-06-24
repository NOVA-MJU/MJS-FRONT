import defaultAvatar from '../../../assets/avatar-default.jpeg';
interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  size?: number;
}

const Avatar = ({
  src = defaultAvatar,
  alt = 'UserAvatar',
  size = 32,
  style,
  ...props
}: AvatarProps) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        ...style,
      }}
      {...props}
    />
  );
};

export default Avatar;
