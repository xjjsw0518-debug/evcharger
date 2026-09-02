import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Link2, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useLang } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Image } from '@/components/ui/image';

export default function LogoSettingsSection() {
  const { lang } = useLang();
  const { settings, updateSettings, resetSettings, loaded } = useSiteSettings();
  const [urlInput, setUrlInput] = useState(settings.logoUrl);
  const [brandNameInput, setBrandNameInput] = useState(settings.brandName);
  const [brandSubtitleInput, setBrandSubtitleInput] = useState(settings.brandSubtitle);
  const [resetOpen, setResetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // 当设置从服务器加载完成后，同步输入框的值
  useEffect(() => {
    if (loaded && !initializedRef.current) {
      setUrlInput(settings.logoUrl);
      setBrandNameInput(settings.brandName);
      setBrandSubtitleInput(settings.brandSubtitle);
      initializedRef.current = true;
    }
  }, [loaded, settings.logoUrl, settings.brandName, settings.brandSubtitle]);

  const handleSaveUrl = async () => {
    if (!urlInput.trim()) {
      toast.error(lang === 'zh' ? '请输入Logo图片URL' : 'Please enter logo URL');
      return;
    }
    const success = await updateSettings({ logoUrl: urlInput.trim() });
    if (success) {
      toast.success(lang === 'zh' ? '✅ Logo已保存！所有电脑刷新后即可看到效果' : '✅ Logo saved! All devices will see changes after refresh');
    } else {
      toast.error(lang === 'zh' ? '❌ 保存到服务器失败，请检查网络或管理员密码' : '❌ Save to server failed, please check network or admin password');
    }
  };

  const handleSaveBrand = async () => {
    const success = await updateSettings({
      brandName: brandNameInput.trim() || 'YiLianPu auto',
      brandSubtitle: brandSubtitleInput.trim(),
    });
    if (success) {
      toast.success(lang === 'zh' ? '✅ 品牌名称已保存！所有电脑刷新后即可看到效果' : '✅ Brand name saved! All devices will see changes after refresh');
    } else {
      toast.error(lang === 'zh' ? '❌ 保存到服务器失败，请检查网络或管理员密码' : '❌ Save to server failed, please check network or admin password');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(lang === 'zh' ? '请选择图片文件' : 'Please select an image file');
      return;
    }

    // 检查原始文件大小（不超过 5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error(lang === 'zh' ? '图片文件过大（超过5MB），请先压缩或使用图片URL' : 'Image too large (>5MB), please compress or use image URL');
      return;
    }

    setUploading(true);
    toast.loading(lang === 'zh' ? '正在处理图片...' : 'Processing image...', { id: 'logo-upload' });

    // 压缩图片，支持 PNG 透明背景
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // 横向 logo：最大宽度 320px，高度按比例（不强制正方形）
          const maxWidth = 320;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            toast.error(lang === 'zh' ? '图片处理失败，请重试' : 'Image processing failed, please try again');
            setUploading(false);
            toast.dismiss('logo-upload');
            return;
          }

          // 检查是否为 PNG（支持透明背景），如果是 PNG 则保持透明
          const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
          
          if (!isPng) {
            // 非 PNG 图片，填充白色背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
          }
          
          ctx.drawImage(img, 0, 0, width, height);

          // 根据图片类型选择输出格式
          // PNG 保留透明背景但体积较大，JPEG 体积小但不支持透明
          // 策略：如果原图是 PNG 且有透明区域，输出 PNG；否则输出 JPEG
          let compressedDataUrl: string;
          if (isPng) {
            compressedDataUrl = canvas.toDataURL('image/png');
          } else {
            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          }

          // 检查 base64 大小（KV 存储建议不超过 1MB，超过则进一步压缩）
          if (compressedDataUrl.length > 1 * 1024 * 1024) {
            // 进一步压缩：减小宽度到 240px，使用 JPEG 格式
            const smallMaxWidth = 240;
            let smallWidth = img.width;
            let smallHeight = img.height;
            if (smallWidth > smallMaxWidth) {
              smallHeight = Math.round((smallHeight * smallMaxWidth) / smallWidth);
              smallWidth = smallMaxWidth;
            }
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = smallWidth;
            smallCanvas.height = smallHeight;
            const smallCtx = smallCanvas.getContext('2d');
            if (smallCtx) {
              smallCtx.fillStyle = '#ffffff';
              smallCtx.fillRect(0, 0, smallWidth, smallHeight);
              smallCtx.drawImage(img, 0, 0, smallWidth, smallHeight);
              compressedDataUrl = smallCanvas.toDataURL('image/jpeg', 0.85);
            }
          }

          // 最终检查（不超过 2MB）
          if (compressedDataUrl.length > 2 * 1024 * 1024) {
            toast.error(lang === 'zh' ? '图片压缩后仍然过大，请使用更小的图片或图片URL' : 'Compressed image still too large, please use a smaller image or URL');
            setUploading(false);
            toast.dismiss('logo-upload');
            return;
          }

          try {
            const success = await updateSettings({ logoUrl: compressedDataUrl });
            setUrlInput(compressedDataUrl);
            if (success) {
              toast.success(lang === 'zh' ? '✅ Logo已上传并保存！所有电脑刷新后即可看到效果' : '✅ Logo uploaded and saved! All devices will see changes after refresh', { id: 'logo-upload' });
            } else {
              toast.error(lang === 'zh' ? '⚠️ 保存到服务器失败，但已保存在本地。请检查网络或管理员密码' : '⚠️ Save to server failed, but saved locally. Please check network or admin password', { id: 'logo-upload' });
            }
          } catch (err) {
            toast.error(lang === 'zh' ? '保存失败，请重试' : 'Save failed, please try again', { id: 'logo-upload' });
          }
        } catch (err) {
          console.error('Image processing error:', err);
          toast.error(lang === 'zh' ? '图片处理失败，请重试或使用图片URL' : 'Image processing failed, please try again or use image URL', { id: 'logo-upload' });
        } finally {
          setUploading(false);
        }
      };
      img.onerror = () => {
        toast.error(lang === 'zh' ? '图片加载失败，请检查文件格式' : 'Failed to load image, please check file format', { id: 'logo-upload' });
        setUploading(false);
      };
      img.src = ev.target?.result as string;
    };
    reader.onerror = () => {
      toast.error(lang === 'zh' ? '图片读取失败，请重试' : 'Failed to read image, please try again', { id: 'logo-upload' });
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // 重置 input，允许重复上传同一文件
    e.target.value = '';
  };

  const handleReset = async () => {
    await resetSettings();
    setUrlInput('');
    toast.success(lang === 'zh' ? '已恢复默认设置，所有电脑同步生效' : 'Reset to default, synced to all devices');
    setResetOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? 'Logo 与品牌设置' : 'Logo & Brand Settings'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '上传或修改站点Logo、品牌名称和副标题，保存后全站导航栏、页脚立即生效' : 'Upload or modify site logo, brand name & subtitle, applied to header & footer instantly'}
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
            <CardTitle>{lang === 'zh' ? 'Logo 上传' : 'Logo Upload'}</CardTitle>
            <CardDescription>
              {lang === 'zh' ? '支持输入图片URL或上传本地图片，建议尺寸 200x60 像素' : 'Enter image URL or upload local file. Recommended size: 200x60px'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="url" className="flex-1 gap-1.5">
                  <Link2 className="size-3.5" />
                  {lang === 'zh' ? '图片URL' : 'Image URL'}
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex-1 gap-1.5">
                  <Upload className="size-3.5" />
                  {lang === 'zh' ? '本地上传' : 'Upload'}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label>{lang === 'zh' ? 'Logo 图片 URL' : 'Logo Image URL'}</Label>
                  <Input
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleSaveUrl} className="w-full gap-1.5">
                  <ImageIcon className="size-4" />
                  {lang === 'zh' ? '保存并应用到全站' : 'Save & Apply Site-wide'}
                </Button>
                <p className="text-xs text-amber-600 text-center">
                  {lang === 'zh' ? '⚠️ 修改后必须点击保存按钮，才会应用到首页网站' : '⚠️ Must click Save to apply changes to the live site'}
                </p>
              </TabsContent>
              <TabsContent value="upload" className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-24 border-dashed flex-col gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        {lang === 'zh' ? '正在处理图片...' : 'Processing image...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {lang === 'zh' ? '点击选择图片上传（支持PNG透明背景）' : 'Click to upload (PNG with transparency supported)'}
                      </span>
                    </>
                  )}
                </Button>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {lang === 'zh' ? '• 支持 PNG / JPG / WebP 格式，PNG 保留透明背景' : '• PNG / JPG / WebP supported, PNG preserves transparency'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'zh' ? '• 建议横向 logo，尺寸约 320x100 像素' : '• Recommended horizontal logo, ~320x100px'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'zh' ? '• 原始文件不超过 5MB，自动压缩优化' : '• Max 5MB original, auto-compressed'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 品牌名称设置 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{lang === 'zh' ? '品牌名称设置' : 'Brand Name Settings'}</CardTitle>
            <CardDescription>
              {lang === 'zh' ? '修改Logo旁边显示的公司名称和副标题，保存后全站立即生效' : 'Modify the brand name and subtitle displayed next to the logo'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '品牌名称' : 'Brand Name'}</Label>
              <Input
                value={brandNameInput}
                onChange={e => setBrandNameInput(e.target.value)}
                placeholder={lang === 'zh' ? '例如：youpei auto' : 'e.g., youpei auto'}
              />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '品牌副标题' : 'Brand Subtitle'}</Label>
              <Input
                value={brandSubtitleInput}
                onChange={e => setBrandSubtitleInput(e.target.value)}
                placeholder={lang === 'zh' ? '例如：EV Charging Specialist（留空则不显示）' : 'e.g., EV Charging Specialist (leave empty to hide)'}
              />
            </div>
            <Button onClick={handleSaveBrand} className="w-full gap-1.5">
              <ImageIcon className="size-4" />
              {lang === 'zh' ? '保存并应用到全站' : 'Save & Apply Site-wide'}
            </Button>
            <p className="text-xs text-amber-600 text-center">
              {lang === 'zh' ? '⚠️ 修改后必须点击保存按钮，才会应用到首页网站' : '⚠️ Must click Save to apply changes to the live site'}
            </p>
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
              {lang === 'zh' ? 'Logo在导航栏中的显示效果' : 'How the logo appears in the navigation bar'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 模拟导航栏预览 - 实时显示输入框中的值 */}
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <div className="bg-card border-b border-border/40 px-4 h-20 flex items-center">
                <div className="flex items-center gap-2.5">
                  {/* 横向 logo，按照原始比例显示，完全透明无背景，与右侧文字高度对齐 */}
                  <div className="shrink-0 flex items-center justify-center" style={{ height: 44, background: 'transparent' }}>
                    <img
                      src={urlInput || 'https://aka.doubaocdn.com/s/OhaBaatK4F'}
                      alt="Logo preview"
                      className="object-contain h-full w-auto max-w-none"
                      style={{ height: 44, width: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', display: 'block' }}
                    />
                  </div>
                  <div className="flex flex-col leading-none justify-center">
                    <span
                      className="font-extrabold text-lg tracking-tight whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 40%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.2,
                      }}
                    >
                      {brandNameInput || 'YiLianPu auto'}
                    </span>
                    {brandSubtitleInput && (
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 tracking-wider uppercase whitespace-nowrap" style={{ lineHeight: 1.2 }}>
                        {brandSubtitleInput}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-muted/30 text-center text-sm text-muted-foreground">
                {lang === 'zh' ? '导航栏预览（实时）' : 'Header preview (live)'}
              </div>
            </div>

            {/* 模拟页脚预览 - 实时显示输入框中的值 */}
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <div className="bg-foreground text-background px-4 py-5 flex items-center">
                <div className="flex items-center gap-2">
                  {/* 横向 logo，按照原始比例显示，完全透明无背景 */}
                  <div className="shrink-0 flex items-center justify-center" style={{ height: 32, background: 'transparent' }}>
                    <img
                      src={urlInput || 'https://aka.doubaocdn.com/s/OhaBaatK4F'}
                      alt="Logo footer preview"
                      className="object-contain h-full w-auto max-w-none"
                      style={{ height: 32, width: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', display: 'block' }}
                    />
                  </div>
                  <div className="flex flex-col leading-none justify-center">
                    <span className="font-bold text-base whitespace-nowrap" style={{ lineHeight: 1.2 }}>{brandNameInput || 'YiLianPu auto'}</span>
                    {brandSubtitleInput && (
                      <span className="text-[9px] text-background/60 tracking-widest uppercase whitespace-nowrap mt-0.5" style={{ lineHeight: 1.2 }}>
                        {brandSubtitleInput}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 text-center text-xs text-muted-foreground">
                {lang === 'zh' ? '页脚预览（实时）' : 'Footer preview (live)'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 恢复确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认Logo？' : 'Reset to default logo?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '将恢复为系统默认Logo，当前自定义Logo设置将被清除。'
                : 'This will revert to the default logo and clear your custom settings.'}
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
