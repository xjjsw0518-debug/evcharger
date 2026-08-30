import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useContactSettings } from '@/hooks/useContactSettings';
import { Image } from '@/components/ui/image';

export default function VideoSection() {
  const { lang } = useLang();
  const { settings } = useSiteSettings();
  const { getWaUrl, loaded: contactLoaded } = useContactSettings();

  if (!settings.videoEnabled) return null;
  if (!contactLoaded) return null;
  const waUrl = getWaUrl();

  const hasVideo = settings.videoUrl && settings.videoUrl.trim() !== '';
  const coverUrl = settings.videoCoverUrl || 'https://picsum.photos/seed/ev-charging-station-video/1200/514';

  const handlePlay = () => {
    if (hasVideo) {
      window.open(settings.videoUrl, '_blank');
    } else {
      window.open(waUrl, '_blank');
    }
  };

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
            {lang === 'zh' ? '产品实拍视频' : 'Product Videos'}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {lang === 'zh' ? '真实产品展示 · 工厂实拍' : 'Real Product Showcases · Factory Footage'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {lang === 'zh'
              ? '观看我们的产品实拍和工厂生产视频，直观了解产品品质与生产实力'
              : 'Watch our product demos and factory production videos to see our quality and capabilities firsthand'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl shadow-emerald-900/10"
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="size-20 md:size-24 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/30 group-hover:scale-110 group-hover:bg-[#22c55e] transition-all duration-300">
                  <Play className="size-8 md:size-10 ml-1 fill-current" />
                </div>
                <p className="text-white/90 text-sm md:text-base font-medium">
                  {hasVideo
                    ? (lang === 'zh' ? '点击播放视频' : 'Click to play video')
                    : (lang === 'zh' ? '点击观看产品介绍视频' : 'Click to watch product introduction video')}
                </p>
              </div>
            </div>

            {/* 时长标识 */}
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-medium">
              {hasVideo ? 'Video' : 'Coming Soon'}
            </div>

            {/* 视频类型标签 */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {lang === 'zh' ? '工厂实拍' : 'Factory Tour'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {lang === 'zh' ? '产品演示' : 'Product Demo'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
