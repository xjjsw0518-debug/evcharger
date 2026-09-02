import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { getLogoUrl, loaded, settings } = useSiteSettings();

  // 横向 logo 的高度设置（与右侧文字区域高度对齐）
  // 文字区域高度 = 主标题行高 + 副标题行高 + 间距
  const sizeMap = {
    sm: { logoHeight: 32, text: 'text-base', subtitle: 'text-[9px]', gap: 'gap-2', mt: 'mt-0.5' },
    md: { logoHeight: 44, text: 'text-lg', subtitle: 'text-[10px]', gap: 'gap-2.5', mt: 'mt-1' },
    lg: { logoHeight: 56, text: 'text-xl', subtitle: 'text-[11px]', gap: 'gap-3', mt: 'mt-1' },
  };
  const s = sizeMap[size];
  const logoUrl = loaded ? getLogoUrl() : 'https://aka.doubaocdn.com/s/OhaBaatK4F';
  const brandName = settings?.brandName || 'youpei auto';
  const brandSubtitle = settings?.brandSubtitle || 'EV Charging Specialist';

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      {/* Logo 图片 - 使用原生 img 确保完全透明无背景，按照原始比例显示 */}
      <div 
        className="shrink-0 flex items-center justify-center"
        style={{ height: s.logoHeight, background: 'transparent' }}
      >
        <img
          src={logoUrl}
          alt={`${brandName} logo`}
          className="object-contain h-full w-auto max-w-none"
          style={{ 
            height: s.logoHeight, 
            width: 'auto', 
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 0,
            display: 'block',
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none justify-center">
          {/* 主标题：whitespace-nowrap 防止换行 */}
          <span
            className={cn('font-extrabold tracking-tight whitespace-nowrap', s.text)}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 40%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
            }}
          >
            {brandName}
          </span>
          {brandSubtitle && (
            <span 
              className={cn('text-emerald-600 font-semibold tracking-wider uppercase whitespace-nowrap', s.subtitle, s.mt)}
              style={{ lineHeight: 1.2 }}
            >
              {brandSubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
