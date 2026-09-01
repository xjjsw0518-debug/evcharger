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
  // 文字区域高度 = 主标题行高 + 副标题行高 + 间距 ≈ 48px
  const sizeMap = {
    sm: { height: 36, text: 'text-lg', gap: 'gap-2.5' },
    md: { height: 48, text: 'text-xl', gap: 'gap-3' },
    lg: { height: 60, text: 'text-2xl', gap: 'gap-3.5' },
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
        style={{ height: s.height, background: 'transparent' }}
      >
        <img
          src={logoUrl}
          alt={`${brandName} logo`}
          className="object-contain h-full w-auto"
          style={{ 
            height: s.height, 
            width: 'auto', 
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 0,
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          {/* 主标题：whitespace-nowrap 防止换行，文字稍小确保一行显示 */}
          <span
            className={cn('font-extrabold tracking-tight whitespace-nowrap', s.text)}
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
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 tracking-wider uppercase whitespace-nowrap">
              {brandSubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
