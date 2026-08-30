import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/image';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { getLogoUrl, loaded } = useSiteSettings();

  const sizeMap = {
    sm: { icon: 28, text: 'text-base', gap: 'gap-2' },
    md: { icon: 36, text: 'text-lg',   gap: 'gap-2.5' },
    lg: { icon: 56, text: 'text-2xl',  gap: 'gap-3' },
  };
  const s = sizeMap[size];
  const logoUrl = loaded ? getLogoUrl() : 'https://aka.doubaocdn.com/s/OhaBaatK4F';

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <Image
        src={logoUrl}
        alt="youpei auto logo"
        width={s.icon}
        height={s.icon}
        className="shrink-0 object-contain"
        style={{ width: s.icon, height: s.icon }}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-bold tracking-tight', s.text)}
            style={{
              background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 50%, #ff6d00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            youpei auto
          </span>
          {size === 'lg' && (
            <span className="text-[10px] text-muted-foreground mt-0.5 tracking-widest uppercase">
              Auto Parts Supplier
            </span>
          )}
        </div>
      )}
    </div>
  );
}
