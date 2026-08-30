import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Image } from '@/components/ui/image';

export default function VideoSection() {
  const { lang } = useLang();
  const { settings } = useSiteSettings();
  const [showPlayer, setShowPlayer] = useState(false);

  if (!settings.videoEnabled) return null;

  const hasVideo = settings.videoUrl && settings.videoUrl.trim() !== '';
  const coverUrl = settings.videoCoverUrl || 'https://picsum.photos/seed/ev-charging-station-video/1200/514';

  const handlePlay = () => {
    if (hasVideo) {
      setShowPlayer(true);
    }
    // 没有视频时不做任何操作，不再打开 WhatsApp
  };

  // 检测视频类型并生成嵌入 URL
  const getEmbedUrl = (url: string): string | null => {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    
    // YouTube Shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0`;
    
    return null;
  };

  const embedUrl = hasVideo ? getEmbedUrl(settings.videoUrl) : null;
  const isDirectVideo = hasVideo && !embedUrl; // 直接视频文件

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium mb-3">
            <Play className="size-3.5 fill-current" />
            {lang === 'zh' ? '产品与工厂展示' : 'Product & Factory Showcases'}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {lang === 'zh' ? '真实产品展示 · 工厂实拍' : 'Real Product Showcases · Factory Footage'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {lang === 'zh'
              ? '观看我们的产品展示和工厂生产视频，直观了解产品品质与生产实力'
              : 'Watch our product showcases and factory production videos to see our quality and capabilities firsthand'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/10 ${hasVideo ? 'group cursor-pointer' : ''}`}
          onClick={handlePlay}
        >
          {/* 视频封面 */}
          <div className="relative aspect-[21/9] bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 overflow-hidden">
            <Image
              src={coverUrl}
              alt="EV charging product showcase video"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/30 to-transparent" />

            {/* 播放按钮 */}
            {hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-20 md:size-24 rounded-full bg-white/95 text-emerald-600 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    <Play className="size-8 md:size-10 ml-1 fill-current" />
                  </div>
                  <p className="text-white/90 text-sm md:text-base font-medium">
                    {lang === 'zh' ? '点击播放视频' : 'Click to play video'}
                  </p>
                </div>
              </div>
            )}

            {/* 无视频时的提示 */}
            {!hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-16 md:size-20 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
                    <Play className="size-6 md:size-8 ml-1 fill-current opacity-60" />
                  </div>
                  <p className="text-white/80 text-sm md:text-base font-medium">
                    {lang === 'zh' ? '视频即将上线' : 'Video coming soon'}
                  </p>
                </div>
              </div>
            )}

            {/* 时长标识 */}
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-medium">
              {hasVideo ? (lang === 'zh' ? '视频' : 'Video') : (lang === 'zh' ? '即将上线' : 'Coming Soon')}
            </div>

            {/* 视频类型标签 */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {lang === 'zh' ? '工厂实拍' : 'Factory Footage'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {lang === 'zh' ? '产品展示' : 'Product Showcase'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 视频播放模态框 */}
      {showPlayer && hasVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowPlayer(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-3 right-3 z-10 size-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Close video"
            >
              <X className="size-5" />
            </button>

            {/* YouTube/Vimeo 嵌入 */}
            {embedUrl && (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Product showcase video"
              />
            )}

            {/* 直接视频文件 */}
            {isDirectVideo && (
              <video
                src={settings.videoUrl}
                className="absolute inset-0 w-full h-full object-contain"
                controls
                autoPlay
                title="Product showcase video"
              >
                {lang === 'zh' ? '您的浏览器不支持视频播放。' : 'Your browser does not support video playback.'}
              </video>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
