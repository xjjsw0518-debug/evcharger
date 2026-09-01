import { useState, useRef } from 'react';
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
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [urlInput, setUrlInput] = useState(settings.logoUrl);
  const [brandNameInput, setBrandNameInput] = useState(settings.brandName);
  const [brandSubtitleInput, setBrandSubtitleInput] = useState(settings.brandSubtitle);
  const [resetOpen, setResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveUrl = () => {
    if (!urlInput.trim()) {
      toast.error(lang === 'zh' ? '请输入Logo图片URL' : 'Please enter logo URL');
      return;
    }
    updateSettings({ logoUrl: urlInput.trim() });
    toast.success(lang === 'zh' ? 'Logo已保存，全站立即生效' : 'Logo saved, applied site-wide');
  };

  const handleSaveBrand = () => {
    updateSettings({
      brandName: brandNameInput.trim() || 'youpei auto',
      brandSubtitle: brandSubtitleInput.trim(),
    });
    toast.success(lang === 'zh' ? '品牌名称已保存，全站立即生效' : 'Brand name saved, applied site-wide');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(lang === 'zh' ? '请选择图片文件' : 'Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      updateSettings({ logoUrl: result });
      setUrlInput(result);
      toast.success(lang === 'zh' ? 'Logo已上传并生效' : 'Logo uploaded and applied');
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    resetSettings();
    setUrlInput('');
    toast.success(lang === 'zh' ? '已恢复默认设置' : 'Reset to default');
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
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-dashed flex-col gap-2"
                >
                  <Upload className="size-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {lang === 'zh' ? '点击或拖拽图片到此处上传' : 'Click to upload or drag & drop'}
                  </span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  {lang === 'zh' ? '图片将转换为base64存储在本地，适合小尺寸Logo' : 'Images are stored as base64 locally, suitable for small logos'}
                </p>
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
              <div className="bg-card border-b border-border/40 px-4 h-16 flex items-center">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={urlInput || 'https://aka.doubaocdn.com/s/OhaBaatK4F'}
                    alt="Logo preview"
                    width={36}
                    height={36}
                    className="shrink-0 object-contain"
                    style={{ width: 36, height: 36 }}
                  />
                  <div className="flex flex-col leading-none">
                    <span
                      className="font-extrabold text-lg tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 40%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {brandNameInput || 'youpei auto'}
                    </span>
                    {brandSubtitleInput && (
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 tracking-wider uppercase">
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
              <div className="bg-foreground text-background px-4 py-6 flex items-center">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={urlInput || 'https://aka.doubaocdn.com/s/OhaBaatK4F'}
                    alt="Logo footer preview"
                    width={32}
                    height={32}
                    className="shrink-0 object-contain"
                    style={{ width: 32, height: 32 }}
                  />
                  <div className="flex flex-col leading-none">
                    <span className="font-bold text-base">{brandNameInput || 'youpei auto'}</span>
                    {brandSubtitleInput && (
                      <span className="text-[10px] text-background/60 tracking-widest uppercase">
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
