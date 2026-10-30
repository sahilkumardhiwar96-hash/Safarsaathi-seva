import { getInitials, getAvatarColor } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };
  return (
    <div className={`${sizes[size]} ${getAvatarColor(name)} flex shrink-0 items-center justify-center rounded-full font-semibold text-white`}>
      {getInitials(name)}
    </div>
  );
}
