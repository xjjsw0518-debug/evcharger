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

  const sizeMap = {
    sm: { icon: 36, text: 'text-lg', gap: 'gap-2.5' },
    md: { icon: 52, text: 'text-xl',   gap: 'gap-3' },
    lg: { icon: 72, text: 'text-3xl',  gap: 'gap-3.5' },
  };
  const s = sizeMap[size];
  const logoUrl = loaded ? getLogoUrl() : 'https://aka.doubaocdn.com/s/OhaBaatK4F';
  const brandName = settings?.brandName || 'youpei auto';
  const brandSubtitle = settings?.brandSubtitle || 'EV Charging Specialist';

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      {/* Logo 图标 - 添加白色背景圆角和阴影，更醒目 */}
      <div 
        className="shrink-0 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-black/5 flex items-center justify-center"
        style={{ width: s.icon + 12, height: s.icon + 12 }}
      >
        <Image
          src={logoUrl}
          alt={`${brandName} logo`}
          width={s.icon}
          height={s.icon}
          className="object-contain"
          style={{ width: s.icon, height: s.icon }}
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
