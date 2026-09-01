import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Link2, RotateCcw, Eye, Type, MoveHorizontal, MoveVertical, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, MessageCircle } from 'lucide-react';
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

export default function HeroSettingsSection() {
  const { lang } = useLang();
  const { settings, updateSettings, resetSettings, loaded } = useSiteSettings();
  const [heroBgUrl, setHeroBgUrl] = useState(settings.heroBgUrl);
  const [heroTitleZh, setHeroTitleZh] = useState(settings.heroTitleZh);
  const [heroTitleEn, setHeroTitleEn] = useState(settings.heroTitleEn);
  const [heroSubtitleZh, setHeroSubtitleZh] = useState(settings.heroSubtitleZh);
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(settings.heroSubtitleEn);
  const [heroAlign, setHeroAlign] = useState<'left' | 'center' | 'right'>(settings.heroAlign);
  const [heroVerticalOffset, setHeroVerticalOffset] = useState(settings.heroVerticalOffset);
  const [heroButtonGap, setHeroButtonGap] = useState(settings.heroButtonGap);
  const [resetOpen, setResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // 当设置从服务器加载完成后，同步输入框的值
  useEffect(() => {
    if (loaded && !initializedRef.current) {
      setHeroBgUrl(settings.heroBgUrl);
      setHeroTitleZh(settings.heroTitleZh);
      setHeroTitleEn(settings.heroTitleEn);
      setHeroSubtitleZh(settings.heroSubtitleZh);
      setHeroSubtitleEn(settings.heroSubtitleEn);
      setHeroAlign(settings.heroAlign);
      setHeroVerticalOffset(settings.heroVerticalOffset);
      setHeroButtonGap(settings.heroButtonGap);
      initializedRef.current = true;
    }
  }, [loaded, settings]);

  const handleSaveBg = async () => {
    const success = await updateSettings({ heroBgUrl: heroBgUrl.trim() });
    if (success) {
      toast.success(lang === 'zh' ? '✅ Hero背景图已保存到服务器！所有电脑同步生效' : '✅ Hero background saved to server! Synced to all devices');
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
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const result = ev.target?.result as string;
      const success = await updateSettings({ heroBgUrl: result });
      setHeroBgUrl(result);
      if (success) {
        toast.success(lang === 'zh' ? '✅ Hero背景图已上传并保存到服务器！所有电脑同步生效' : '✅ Hero background uploaded and saved to server! Synced to all devices');
      } else {
        toast.error(lang === 'zh' ? '⚠️ 保存到服务器失败，但已保存在本地' : '⚠️ Save to server failed, but saved locally');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveText = async () => {
    const success = await updateSettings({
      heroTitleZh: heroTitleZh.trim(),
      heroTitleEn: heroTitleEn.trim(),
      heroSubtitleZh: heroSubtitleZh.trim(),
      heroSubtitleEn: heroSubtitleEn.trim(),
    });
    if (success) {
      toast.success(lang === 'zh' ? '✅ Hero文字已保存到服务器！所有电脑同步生效' : '✅ Hero text saved to server! Synced to all devices');
    } else {
      toast.error(lang === 'zh' ? '❌ 保存到服务器失败，请检查网络或管理员密码' : '❌ Save to server failed, please check network or admin password');
    }
  };

  const handleSaveLayout = async () => {
    const success = await updateSettings({
      heroAlign,
      heroVerticalOffset,
      heroButtonGap,
    });
    if (success) {
      toast.success(lang === 'zh' ? '✅ Hero布局已保存到服务器！所有电脑同步生效' : '✅ Hero layout saved to server! Synced to all devices');
    } else {
      toast.error(lang === 'zh' ? '❌ 保存到服务器失败，请检查网络或管理员密码' : '❌ Save to server failed, please check network or admin password');
    }
  };

  const handleReset = async () => {
    await resetSettings();
    setHeroBgUrl('https://aka.doubaocdn.com/s/1miAfPPz6y');
    setHeroTitleZh('EV 充电配件批发\n中国工厂直供');
    setHeroTitleEn('Wholesale EV Charging Accessories\nDirect from China Factory');
    setHeroSubtitleZh('GBT / Type 2 充电枪、转接器、便携式充电桩、V2L 放电器全品类覆盖。MOQ 2-5 件起批，CE 认证，全球发货。');
    setHeroSubtitleEn('GBT / Type 2 charging guns, adapters, portable chargers, V2L adapters - all in one place. MOQ 2-5 pcs, CE certified, global shipping.');
    setHeroAlign('center');
    setHeroVerticalOffset(0);
    setHeroButtonGap(12);
    toast.success(lang === 'zh' ? '已恢复默认设置，所有电脑同步生效' : 'Reset to default, synced to all devices');
    setResetOpen(false);
  };

  const previewTitle = (langKey: 'zh' | 'en') => {
    const raw = langKey === 'zh' ? heroTitleZh : heroTitleEn;
    return raw || (langKey === 'zh' ? 'EV 充电配件批发\n中国工厂直供' : 'Wholesale EV Charging Accessories\nDirect from China Factory');
  };

  const previewAlignClass =
    heroAlign === 'left' ? 'text-left items-start' :
    heroAlign === 'right' ? 'text-right items-end' :
    'text-center items-center';
  const previewJustifyClass =
    heroAlign === 'left' ? 'justify-start' :
    heroAlign === 'right' ? 'justify-end' :
    'justify-center';

  const previewSubtitle = (langKey: 'zh' | 'en') => {
    const raw = langKey === 'zh' ? heroSubtitleZh : heroSubtitleEn;
    return raw || (langKey === 'zh'
      ? 'GBT / Type 2 充电枪、转接器、便携式充电桩、V2L 放电器全品类覆盖。'
      : 'GBT / Type 2 charging guns, adapters, portable chargers, V2L adapters - all in one place.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '首页 Hero 设置' : 'Homepage Hero Settings'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '自定义首页Hero背景图、主标题和副标题' : 'Customize homepage hero background, title, and subtitle'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
          <RotateCcw className="size-4" />
          {lang === 'zh' ? '恢复默认' : 'Reset'}
        </Button>
      </div>

      {/* Hero 背景图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{lang === 'zh' ? 'Hero 背景大图' : 'Hero Background Image'}</CardTitle>
            <CardDescription>
              {lang === 'zh' ? '首页顶部全屏背景图，建议尺寸 1920x1080' : 'Full-width hero background. Recommended size: 1920x1080'}
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
                  <Label>{lang === 'zh' ? '背景图 URL' : 'Background Image URL'}</Label>
                  <Input
                    value={heroBgUrl}
                    onChange={e => setHeroBgUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleSaveBg} className="w-full gap-1.5">
                  <ImageIcon className="size-4" />
                  {lang === 'zh' ? '保存背景图' : 'Save Background'}
                </Button>
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
                    {lang === 'zh' ? '点击选择图片上传' : 'Click to select and upload'}
                  </span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  {lang === 'zh' ? '图片将以base64形式存储在本地浏览器' : 'Image stored as base64 in local browser'}
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 预览：背景图 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-4" />
              {lang === 'zh' ? '背景预览' : 'Background Preview'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? 'Hero背景图实际显示效果' : 'How the hero background appears'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-muted/50 border border-border/50">
              <Image
                src={heroBgUrl || 'https://aka.doubaocdn.com/s/1miAfPPz6y'}
                alt="Hero background preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-teal-900/40" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="text-white text-lg md:text-xl font-bold leading-tight">
                  {previewTitle(lang as 'zh' | 'en').split('\n').map((l, i) => (
                    <div key={i} className={i > 0 ? 'text-emerald-300' : ''}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero 文字 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="size-4" />
              {lang === 'zh' ? 'Hero 文字内容' : 'Hero Text Content'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '主标题支持换行（回车换行），最后一行将以渐变色显示' : 'Title supports line breaks; last line appears in gradient'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '主标题（中文）' : 'Main Title (Chinese)'}</Label>
              <Textarea
                value={heroTitleZh}
                onChange={e => setHeroTitleZh(e.target.value)}
                rows={3}
                placeholder={lang === 'zh' ? '第一行标题\n第二行标题（渐变色）' : 'Line 1 title\nLine 2 (gradient)'}
              />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '主标题（英文）' : 'Main Title (English)'}</Label>
              <Textarea
                value={heroTitleEn}
                onChange={e => setHeroTitleEn(e.target.value)}
                rows={3}
                placeholder="Line 1 title\nLine 2 (gradient)"
              />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '副标题（中文）' : 'Subtitle (Chinese)'}</Label>
              <Textarea
                value={heroSubtitleZh}
                onChange={e => setHeroSubtitleZh(e.target.value)}
                rows={3}
                placeholder={lang === 'zh' ? '副标题文案...' : 'Subtitle copy...'}
              />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '副标题（英文）' : 'Subtitle (English)'}</Label>
              <Textarea
                value={heroSubtitleEn}
                onChange={e => setHeroSubtitleEn(e.target.value)}
                rows={3}
                placeholder="Subtitle copy..."
              />
            </div>
            <Button onClick={handleSaveText} className="w-full gap-1.5">
              {lang === 'zh' ? '保存文字' : 'Save Text'}
            </Button>
          </CardContent>
        </Card>

        {/* 预览：文字 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-4" />
              {lang === 'zh' ? '文字预览' : 'Text Preview'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? 'Hero文字在前台的实际显示效果' : 'How hero text appears on the homepage'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 中文预览 */}
            <div className="border border-border/50 rounded-xl p-5 bg-gradient-to-br from-emerald-950 to-teal-900">
              <div className="text-xs text-emerald-300/70 mb-3">中文 / Chinese</div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {previewTitle('zh').split('\n').map((l, i) => {
                  const isLast = i === previewTitle('zh').split('\n').length - 1 && previewTitle('zh').split('\n').length > 1;
                  return (
                    <div key={i}>
                      {isLast ? (
                        <span
                          style={{
                            background: 'linear-gradient(90deg, #34d399 0%, #fbbf24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {l}
                        </span>
                      ) : l}
                    </div>
                  );
                })}
              </h3>
              <p className="text-white/70 text-sm mt-3 leading-relaxed whitespace-pre-line">
                {previewSubtitle('zh')}
              </p>
            </div>

            {/* 英文预览 */}
            <div className="border border-border/50 rounded-xl p-5 bg-gradient-to-br from-emerald-950 to-teal-900">
              <div className="text-xs text-emerald-300/70 mb-3">English</div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {previewTitle('en').split('\n').map((l, i) => {
                  const lines = previewTitle('en').split('\n');
                  const isLast = i === lines.length - 1 && lines.length > 1;
                  return (
                    <div key={i}>
                      {isLast ? (
                        <span
                          style={{
                            background: 'linear-gradient(90deg, #34d399 0%, #fbbf24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {l}
                        </span>
                      ) : l}
                    </div>
                  );
                })}
              </h3>
              <p className="text-white/70 text-sm mt-3 leading-relaxed whitespace-pre-line">
                {previewSubtitle('en')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero 布局控制 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoveHorizontal className="size-4" />
              {lang === 'zh' ? 'Hero 内容布局' : 'Hero Content Layout'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '调整主标题、副标题和CTA按钮的位置，信任指标位置保持不变' : 'Adjust title, subtitle and CTA button position; trust indicators stay fixed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 水平对齐 */}
            <div className="space-y-3">
              <Label>{lang === 'zh' ? '水平对齐方式' : 'Horizontal Alignment'}</Label>
              <RadioGroup value={heroAlign} onValueChange={v => setHeroAlign(v as 'left' | 'center' | 'right')} className="flex gap-2">
                <div className="flex-1">
                  <RadioGroupItem value="left" id="align-left" className="peer sr-only" />
                  <Label htmlFor="align-left" className="flex items-center justify-center h-10 px-3 rounded-md border border-border/50 bg-card text-sm cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary transition-colors text-center">
                    {lang === 'zh' ? '左对齐' : 'Left'}
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="center" id="align-center" className="peer sr-only" />
                  <Label htmlFor="align-center" className="flex items-center justify-center h-10 px-3 rounded-md border border-border/50 bg-card text-sm cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary transition-colors text-center">
                    {lang === 'zh' ? '居中' : 'Center'}
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="right" id="align-right" className="peer sr-only" />
                  <Label htmlFor="align-right" className="flex items-center justify-center h-10 px-3 rounded-md border border-border/50 bg-card text-sm cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary transition-colors text-center">
                    {lang === 'zh' ? '右对齐' : 'Right'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 垂直偏移 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MoveVertical className="size-3.5" />
                  {lang === 'zh' ? '垂直位置' : 'Vertical Position'}
                </Label>
                <span className="text-sm font-mono text-muted-foreground">{heroVerticalOffset}%</span>
              </div>
              <Slider
                value={[heroVerticalOffset]}
                onValueChange={v => setHeroVerticalOffset(v[0])}
                min={0}
                max={50}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '控制内容区域相对于顶部的偏移量（0% = 靠顶部）' : 'Controls vertical offset from the top (0% = near top)'}
              </p>
            </div>

            {/* 按钮间距 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Maximize2 className="size-3.5" />
                  {lang === 'zh' ? '按钮间距' : 'Button Gap'}
                </Label>
                <span className="text-sm font-mono text-muted-foreground">{heroButtonGap}px</span>
              </div>
              <Slider
                value={[heroButtonGap]}
                onValueChange={v => setHeroButtonGap(v[0])}
                min={4}
                max={40}
                step={2}
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '两个CTA按钮之间的水平间距' : 'Horizontal gap between the two CTA buttons'}
              </p>
            </div>

            <Button onClick={handleSaveLayout} className="w-full gap-1.5">
              {lang === 'zh' ? '保存布局' : 'Save Layout'}
            </Button>
          </CardContent>
        </Card>

        {/* 实时布局预览 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-4" />
              {lang === 'zh' ? '布局实时预览' : 'Live Layout Preview'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '调整参数后可立即预览Hero内容的显示效果' : 'See how hero content looks as you adjust settings'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-muted/30 border border-border/50">
              <Image
                src={heroBgUrl || 'https://aka.doubaocdn.com/s/1miAfPPz6y'}
                alt="Hero layout preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/65 to-teal-900/45" />
              <div
                className="relative w-full px-4"
                style={{ paddingTop: `${heroVerticalOffset + 10}%` }}
              >
                <div className={`space-y-2 flex flex-col ${previewAlignClass}`}>
                  <h4 className="text-base md:text-lg font-bold text-white leading-tight">
                    {previewTitle('en').split('\n').map((l, i) => {
                      const lines = previewTitle('en').split('\n');
                      const isLast = i === lines.length - 1 && lines.length > 1;
                      return (
                        <div key={i}>
                          {isLast ? (
                            <span
                              style={{
                                background: 'linear-gradient(90deg, #34d399 0%, #fbbf24 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                              }}
                            >
                              {l}
                            </span>
                          ) : l}
                        </div>
                      );
                    })}
                  </h4>
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2 max-w-full">
                    {previewSubtitle('en')}
                  </p>
                  <div className={`flex flex-wrap pt-1 ${previewJustifyClass}`} style={{ gap: `${heroButtonGap}px` }}>
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-emerald-950 text-[10px] font-semibold rounded-md">
                      View Products
                      <ArrowRight className="size-2.5" />
                    </button>
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] text-white text-[10px] font-semibold rounded-md">
                      <MessageCircle className="size-2.5" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              {/* 底部信任指标占位 */}
              <div className="absolute bottom-2 left-0 right-0">
                <div className="grid grid-cols-4 gap-1 px-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className="size-5 rounded bg-white/10 border border-white/10" />
                      <div className="text-white/70 text-[8px]">100%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {lang === 'zh' ? '* 底部4个信任指标位置固定不变' : '* Bottom 4 trust indicators remain fixed'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 恢复确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认Hero设置？' : 'Reset hero settings to default?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '将恢复为系统默认的Hero背景图和文字，当前所有自定义设置将被清除。'
                : 'This will revert to the default hero background and text. All custom settings will be cleared.'}
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
