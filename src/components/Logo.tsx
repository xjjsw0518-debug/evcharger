import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/image';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { getLogoUrl, loaded, settings } = useSiteSettings();

  // 横向 logo 的高度设置（更大更突出）
  const sizeMap = {
    sm: { height: 40, text: 'text-lg', gap: 'gap-2.5' },
    md: { height: 56, text: 'text-2xl', gap: 'gap-3' },
    lg: { height: 72, text: 'text-3xl', gap: 'gap-3.5' },
  };
  const s = sizeMap[size];
  const logoUrl = loaded ? getLogoUrl() : 'https://aka.doubaocdn.com/s/OhaBaatK4F';
  const brandName = settings?.brandName || 'youpei auto';
  const brandSubtitle = settings?.brandSubtitle || 'EV Charging Specialist';

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      {/* Logo 图片 - 按照原始比例显示，完全透明无背景无边框 */}
      <div 
        className="shrink-0 flex items-center justify-center bg-transparent border-0 shadow-none rounded-none"
        style={{ height: s.height }}
      >
        <Image
          src={logoUrl}
          alt={`${brandName} logo`}
          className="object-contain h-full w-auto bg-transparent border-0 shadow-none rounded-none"
          style={{ height: s.height, width: 'auto', background: 'transparent' }}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-extrabold tracking-tight', s.text)}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 40%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {brandName}
          </span>
          {size !== 'sm' && brandSubtitle && (
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 tracking-wider uppercase">
              {brandSubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
