import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, QrCode, MessageCircle, RotateCcw, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLang } from '@/context/LanguageContext';
import { useContactSettings } from '@/hooks/useContactSettings';
import { toast } from 'sonner';
import { Image } from '@/components/ui/image';

export default function ContactSettingsSection() {
  const { lang } = useLang();
  const { settings, loaded, updateSettings, resetSettings, getWaNumber } = useContactSettings();

  const [form, setForm] = useState({
    whatsapp: '',
    wechatQrUrl: '',
    wechatId: '',
    email: '',
    addressZh: '',
    addressEn: '',
  });

  useEffect(() => {
    if (loaded) {
      setForm({
        whatsapp: settings.whatsapp,
        wechatQrUrl: settings.wechatQrUrl,
        wechatId: settings.wechatId,
        email: settings.email,
        addressZh: settings.addressZh,
        addressEn: settings.addressEn,
      });
    }
  }, [loaded, settings]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // 清洗邮箱格式：去掉 mailto:、https://、http:// 等前缀，只保留纯邮箱地址
  const cleanEmail = (email: string): string => {
    let cleaned = email.trim();
    // 去掉 https:// 或 http:// 前缀
    cleaned = cleaned.replace(/^https?:\/\//i, '');
    // 去掉 mailto: 前缀
    cleaned = cleaned.replace(/^mailto:/i, '');
    // 去掉末尾的斜杠
    cleaned = cleaned.replace(/\/+$/, '');
    return cleaned.trim();
  };

  const handleSave = async () => {
    const cleanedEmail = cleanEmail(form.email);
    const success = await updateSettings({
      whatsapp: form.whatsapp.trim(),
      wechatQrUrl: form.wechatQrUrl.trim(),
      wechatId: form.wechatId.trim(),
      email: cleanedEmail,
      addressZh: form.addressZh.trim(),
      addressEn: form.addressEn.trim(),
    });
    if (success) {
      // 如果邮箱格式被清洗过，提示用户
      if (cleanedEmail !== form.email.trim()) {
        toast.success(lang === 'zh' 
          ? `✅ 联系信息已保存到服务器！所有电脑同步生效，邮箱已自动清洗为：${cleanedEmail}` 
          : `✅ Contact settings saved to server! Synced to all devices. Email auto-cleaned to: ${cleanedEmail}`);
      } else {
        toast.success(lang === 'zh' ? '✅ 联系信息已保存到服务器！所有电脑同步生效' : '✅ Contact settings saved to server! Synced to all devices');
      }
    } else {
      toast.error(lang === 'zh' ? '❌ 保存到服务器失败，请检查网络或管理员密码' : '❌ Save to server failed, please check network or admin password');
    }
  };

  const handleReset = async () => {
    await resetSettings();
    toast.success(lang === 'zh' ? '已恢复默认设置，所有电脑同步生效' : 'Reset to defaults, synced to all devices');
  };

  if (!loaded) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">Loading...</div>
    );
  }

  const previewWaNumber = getWaNumber();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {lang === 'zh' ? '联系信息设置' : 'Contact Info Settings'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === 'zh'
            ? '配置 WhatsApp、微信、邮箱、地址等联系信息，修改后全站自动同步更新。'
            : 'Configure WhatsApp, WeChat, email and address. Changes apply site-wide automatically.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：表单 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {lang === 'zh' ? '基础信息' : 'Basic Info'}
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '填写公司联系信息，前台所有页面将自动更新' : 'Fill in contact info. All front-end pages update automatically.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="size-4 text-emerald-600" />
                {lang === 'zh' ? 'WhatsApp 号码' : 'WhatsApp Number'}
              </Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={e => handleChange('whatsapp', e.target.value)}
                placeholder="+86 138 0000 0000"
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '支持国际格式，如 +86 138 0000 0000。系统自动清洗用于 wa.me 链接。' : 'International format, e.g. +86 138 0000 0000. Auto-cleaned for wa.me URL.'}
              </p>
              {form.whatsapp && (
                <p className="text-xs font-mono text-emerald-600">
                  wa.me/{cleanWhatsapp(form.whatsapp)}
                </p>
              )}
            </div>

            {/* 微信号 */}
            <div className="space-y-2">
              <Label htmlFor="wechatId">
                {lang === 'zh' ? '微信号' : 'WeChat ID'}
              </Label>
              <Input
                id="wechatId"
                value={form.wechatId}
                onChange={e => handleChange('wechatId', e.target.value)}
                placeholder="youpei_auto_sales"
              />
            </div>

            {/* 微信二维码 URL */}
            <div className="space-y-2">
              <Label htmlFor="wechatQrUrl" className="flex items-center gap-2">
                <QrCode className="size-4 text-[#07C160]" />
                {lang === 'zh' ? '微信二维码图片 URL' : 'WeChat QR Code URL'}
              </Label>
              <Input
                id="wechatQrUrl"
                value={form.wechatQrUrl}
                onChange={e => handleChange('wechatQrUrl', e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '输入微信二维码图片的远程 URL' : 'Enter the remote URL of your WeChat QR code image'}
              </p>
            </div>

            {/* 邮箱 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                {lang === 'zh' ? '邮箱' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="sales@youpei-auto.com"
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' 
                  ? '请输入纯邮箱地址，如 sales@youpei-auto.com，无需添加 mailto: 或 https:// 前缀，系统会自动清洗。注意：页脚设置中的邮箱会优先显示。' 
                  : 'Enter pure email address like sales@youpei-auto.com, no mailto: or https:// prefix needed, system will auto-clean. Note: Footer settings email takes priority.'}
              </p>
            </div>

            {/* 公司地址 - 中文 */}
            <div className="space-y-2">
              <Label htmlFor="addressZh" className="flex items-center gap-2">
                <MapPin className="size-4 text-destructive" />
                {lang === 'zh' ? '公司地址（中文）' : 'Company Address (Chinese)'}
              </Label>
              <Input
                id="addressZh"
                value={form.addressZh}
                onChange={e => handleChange('addressZh', e.target.value)}
                placeholder="中国广东省广州市..."
              />
            </div>

            {/* 公司地址 - 英文 */}
            <div className="space-y-2">
              <Label htmlFor="addressEn">
                {lang === 'zh' ? '公司地址（英文）' : 'Company Address (English)'}
              </Label>
              <Input
                id="addressEn"
                value={form.addressEn}
                onChange={e => handleChange('addressEn', e.target.value)}
                placeholder="Guangzhou, Guangdong, China"
              />
            </div>
          </CardContent>
        </Card>

        {/* 右侧：预览 + 操作 */}
        <div className="space-y-6">
          {/* 二维码预览 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {lang === 'zh' ? '微信二维码预览' : 'WeChat QR Preview'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-border bg-card flex items-center justify-center">
                {form.wechatQrUrl ? (
                  <Image
                    src={form.wechatQrUrl}
                    alt="WeChat QR Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No URL</span>
                )}
              </div>
              {form.wechatId && (
                <p className="mt-3 text-center text-sm font-medium text-foreground">
                  WeChat: {form.wechatId}
                </p>
              )}
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button
                onClick={handleSave}
                className="w-full h-11"
              >
                <Save className="size-4 mr-2" />
                {lang === 'zh' ? '保存设置' : 'Save Settings'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                <RotateCcw className="size-4 mr-2" />
                {lang === 'zh' ? '恢复默认' : 'Reset to Default'}
              </Button>
            </CardContent>
          </Card>

          {/* 小提示 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-5">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                {lang === 'zh' ? '修改后生效范围' : 'Where changes apply'}
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>{lang === 'zh' ? '浮动 WhatsApp / 微信按钮' : 'Floating WhatsApp / WeChat buttons'}</li>
                <li>{lang === 'zh' ? '产品详情页 WhatsApp 按钮' : 'Product detail WhatsApp button'}</li>
                <li>{lang === 'zh' ? '联系页面所有联系信息' : 'Contact page info'}</li>
                <li>{lang === 'zh' ? '首页 CTA / Hero / 视频按钮' : 'Homepage CTA / Hero / Video buttons'}</li>
                <li>{lang === 'zh' ? '页脚联系信息' : 'Footer contact info'}</li>
                <li>{lang === 'zh' ? '关于我们页面' : 'About page'}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 工具函数 - 本地复用，不导出
function cleanWhatsapp(num: string): string {
  return num.replace(/[+\s\-]/g, '');
}
