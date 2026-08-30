import { Play, ExternalLink } from 'lucide-react';

// 检测视频类型
export function detectVideoType(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  return 'direct';
}

// 提取 YouTube 视频 ID
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// 提取 Vimeo 视频 ID
export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

// 视频加载失败时的降级显示
function VideoFallback({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted flex flex-col items-center justify-center gap-3 p-6">
      <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Play className="size-7 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">视频无法自动播放</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <ExternalLink className="size-4" />
        在新窗口打开
      </a>
    </div>
  );
}

interface VideoPlayerProps {
  url: string;
  type?: 'youtube' | 'vimeo' | 'direct';
  title: string;
}

/**
 * 视频播放器组件
 * 支持 YouTube、Vimeo 和直接视频文件（MP4/WebM）
 */
export default function VideoPlayer({ url, type, title }: VideoPlayerProps) {
  if (!url) return null;

  // 自动检测视频类型
  const detectedType = type || detectVideoType(url);

  if (detectedType === 'youtube') {
    const videoId = extractYouTubeId(url);
    if (!videoId) return <VideoFallback url={url} title={title} />;
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (detectedType === 'vimeo') {
    const videoId = extractVimeoId(url);
    if (!videoId) return <VideoFallback url={url} title={title} />;
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 直接视频文件
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <video
        src={url}
        title={title}
        controls
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain"
      >
        您的浏览器不支持视频播放。
      </video>
    </div>
  );
}
