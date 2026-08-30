import { useState } from 'react';
import { Play, Link2, ImageIcon, RotateCcw, Eye, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useLang } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Image } from '@/components/ui/image';

export default function VideoSettingsSection() {
  const { lang } = useLang();
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [videoUrl, setVideoUrl] = useState(settings.videoUrl);
  const [videoCoverUrl, setVideoCoverUrl] = useState(settings.videoCoverUrl);
  const [videoEnabled, setVideoEnabled] = useState(settings.videoEnabled);
  const [resetOpen, setResetOpen] = useState(false);

  const handleSave = () => {
    updateSettings({
      videoUrl: videoUrl.trim(),
      videoCoverUrl: videoCoverUrl.trim(),
      videoEnabled,
    });
    toast.success(lang === 'zh' ? '视频设置已保存' : 'Video settings saved');
  };

  const handleReset = () => {
    resetSettings();
    setVideoUrl('');
    setVideoCoverUrl('');
    setVideoEnabled(true);
    toast.success(lang === 'zh' ? '已恢复默认设置' : 'Reset to default');
    setResetOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '首页视频设置' : 'Homepage Video Settings'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '配置首页视频区域的URL、封面图和显示开关' : 'Configure homepage video URL, cover image, and visibility'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
          <RotateCcw className="size-4" />
          {lang === 'zh' ? '恢复默认' : 'Reset'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 设置区 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{lang === 'zh' ? '视频配置' : 'Video Configuration'}</CardTitle>
            <CardDescription>
              {lang === 'zh' ? '支持MP4直链或YouTube/Vimeo链接' : 'Supports MP4 direct links or YouTube/Vimeo URLs'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
              <div>
                <div className="text-sm font-medium">{lang === 'zh' ? '显示视频区域' : 'Show video section'}</div>
                <div className="text-xs text-muted-foreground">
                  {lang === 'zh' ? '关闭后首页将不展示视频区块' : 'Hide the video section on homepage when disabled'}
                </div>
              </div>
              <Switch checked={videoEnabled} onCheckedChange={setVideoEnabled} />
            </div>

            <div className="space-y-2">
              <Label>{lang === 'zh' ? '视频 URL' : 'Video URL'}</Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... 或 https://.../video.mp4"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '留空时显示占位图+引导联系客服' : 'Leave empty to show placeholder + contact CTA'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{lang === 'zh' ? '视频封面图 URL' : 'Video Cover Image URL'}</Label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={videoCoverUrl}
                  onChange={e => setVideoCoverUrl(e.target.value)}
                  placeholder="https://.../cover.jpg"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '留空时使用默认占位封面' : 'Leave empty for default cover'}
              </p>
            </div>

            <Button onClick={handleSave} className="w-full gap-1.5">
              <Play className="size-4" />
              {lang === 'zh' ? '保存设置' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* 预览区 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-4" />
              {lang === 'zh' ? '实时预览' : 'Live Preview'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '首页视频区块显示效果' : 'Homepage video section preview'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!videoEnabled ? (
              <div className="aspect-video bg-muted/50 rounded-xl flex flex-col items-center justify-center text-muted-foreground">
                <ToggleLeft className="size-8 mb-2" />
                <p className="text-sm">{lang === 'zh' ? '视频区域已关闭' : 'Video section disabled'}</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-md">
                <div className="relative aspect-video bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 overflow-hidden">
                  <Image
                    src={videoCoverUrl || 'https://picsum.photos/seed/ev-charging-station-video/800/450'}
                    alt="Video cover preview"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="size-6 ml-0.5 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs">
                    {videoUrl ? 'Video' : 'Coming Soon'}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 恢复确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认视频设置？' : 'Reset video settings?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '将恢复为系统默认视频配置。'
                : 'This will revert to the default video configuration.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'zh' ? '取消' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              {lang === 'zh' ? '恢复' : 'Reset'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
