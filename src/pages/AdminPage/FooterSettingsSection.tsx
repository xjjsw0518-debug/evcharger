import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
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
import { useSiteSettings, type FooterQuickLink, type FooterSocialItem } from '@/hooks/useSiteSettings';
import { useCategories } from '@/hooks/useCategories';
import { getText } from '@/context/LanguageContext';
import SocialIcon from '@/components/SocialIcon';

const PLATFORM_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'wechat', label: 'WeChat' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'tiktok', label: 'TikTok' },
];

export default function FooterSettingsSection() {
  const { lang } = useLang();
  const { settings, updateSettings, resetSettings, loaded } = useSiteSettings();
  const { categories } = useCategories();

  const [companyName, setCompanyName] = useState(settings.footerCompanyName);
  const [companyDescZh, setCompanyDescZh] = useState(settings.footerCompanyDescZh);
  const [companyDescEn, setCompanyDescEn] = useState(settings.footerCompanyDescEn);
  const [footerEmail, setFooterEmail] = useState(settings.footerEmail);
  const [footerPhone, setFooterPhone] = useState(settings.footerPhone);
  const [footerWhatsapp, setFooterWhatsapp] = useState(settings.footerWhatsapp);
  const [footerAddressZh, setFooterAddressZh] = useState(settings.footerAddressZh);
  const [footerAddressEn, setFooterAddressEn] = useState(settings.footerAddressEn);
  const [copyrightZh, setCopyrightZh] = useState(settings.footerCopyrightZh);
  const [copyrightEn, setCopyrightEn] = useState(settings.footerCopyrightEn);
  const [ctaTitleZh, setCtaTitleZh] = useState(settings.footerCtaTitleZh);
  const [ctaTitleEn, setCtaTitleEn] = useState(settings.footerCtaTitleEn);
  const [ctaDescZh, setCtaDescZh] = useState(settings.footerCtaDescZh);
  const [ctaDescEn, setCtaDescEn] = useState(settings.footerCtaDescEn);

  const [quickLinks, setQuickLinks] = useState<FooterQuickLink[]>(settings.footerQuickLinks || []);
  const [socials, setSocials] = useState<FooterSocialItem[]>(settings.footerSocials || []);

  const [resetOpen, setResetOpen] = useState(false);
  const initializedRef = useRef(false);

  // 当设置从服务器加载完成后，同步所有输入框的值
  useEffect(() => {
    if (loaded && !initializedRef.current) {
      setCompanyName(settings.footerCompanyName);
      setCompanyDescZh(settings.footerCompanyDescZh);
      setCompanyDescEn(settings.footerCompanyDescEn);
      setFooterEmail(settings.footerEmail);
      setFooterPhone(settings.footerPhone);
      setFooterWhatsapp(settings.footerWhatsapp);
      setFooterAddressZh(settings.footerAddressZh);
      setFooterAddressEn(settings.footerAddressEn);
      setCopyrightZh(settings.footerCopyrightZh);
      setCopyrightEn(settings.footerCopyrightEn);
      setCtaTitleZh(settings.footerCtaTitleZh);
      setCtaTitleEn(settings.footerCtaTitleEn);
      setCtaDescZh(settings.footerCtaDescZh);
      setCtaDescEn(settings.footerCtaDescEn);
      setQuickLinks(settings.footerQuickLinks || []);
      setSocials(settings.footerSocials || []);
      initializedRef.current = true;
    }
  }, [loaded, settings]);

  const handleSave = async () => {
    const success = await updateSettings({
      footerCompanyName: companyName.trim(),
      footerCompanyDescZh: companyDescZh.trim(),
      footerCompanyDescEn: companyDescEn.trim(),
      footerEmail: footerEmail.trim(),
      footerPhone: footerPhone.trim(),
      footerWhatsapp: footerWhatsapp.trim(),
      footerAddressZh: footerAddressZh.trim(),
      footerAddressEn: footerAddressEn.trim(),
      footerCopyrightZh: copyrightZh.trim(),
      footerCopyrightEn: copyrightEn.trim(),
      footerCtaTitleZh: ctaTitleZh.trim(),
      footerCtaTitleEn: ctaTitleEn.trim(),
      footerCtaDescZh: ctaDescZh.trim(),
      footerCtaDescEn: ctaDescEn.trim(),
      footerQuickLinks: quickLinks,
      footerSocials: socials,
    });
    if (success) {
      toast.success(lang === 'zh' ? '✅ 页脚设置已保存到服务器！所有电脑同步生效' : '✅ Footer settings saved to server! Synced to all devices');
    } else {
      toast.error(lang === 'zh' ? '❌ 保存到服务器失败，请检查网络或管理员密码' : '❌ Save to server failed, please check network or admin password');
    }
  };

  const handleReset = async () => {
    await resetSettings();
    setResetOpen(false);
    toast.success(lang === 'zh' ? '已恢复默认设置，所有电脑同步生效' : 'Reset to default, synced to all devices');
  };

  // --- 快速链接操作 ---
  const addQuickLink = () => {
    const id = `q_${Date.now()}`;
    setQuickLinks([...quickLinks, { id, labelZh: '新链接', labelEn: 'New Link', url: '/' }]);
  };

  const updateQuickLink = (id: string, field: keyof FooterQuickLink, value: string) => {
    setQuickLinks(quickLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeQuickLink = (id: string) => {
    setQuickLinks(quickLinks.filter(l => l.id !== id));
  };

  // --- 社交媒体操作 ---
  const addSocial = () => {
    const id = `s_${Date.now()}`;
    setSocials([...socials, { id, platform: 'facebook', url: 'https://facebook.com/' }]);
  };

  const updateSocial = (id: string, field: keyof FooterSocialItem, value: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSocial = (id: string) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '页脚设置' : 'Footer Settings'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '自定义页脚公司信息、链接、社交媒体和版权信息' : 'Customize footer company info, links, social media, and copyright'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
            <RotateCcw className="size-4" />
            {lang === 'zh' ? '恢复默认' : 'Reset'}
          </Button>
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="size-4" />
            {lang === 'zh' ? '保存全部' : 'Save All'}
          </Button>
        </div>
      </div>

      {/* 公司信息 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{lang === 'zh' ? '公司信息' : 'Company Information'}</CardTitle>
          <CardDescription>
            {lang === 'zh' ? '显示在页脚左侧的公司名称和联系信息' : 'Company name and contact info shown in the footer'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '公司名称' : 'Company Name'}</Label>
              <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '邮箱地址' : 'Email'}</Label>
              <Input value={footerEmail} onChange={e => setFooterEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '电话号码' : 'Phone'}</Label>
              <Input value={footerPhone} onChange={e => setFooterPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={footerWhatsapp} onChange={e => setFooterWhatsapp(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '公司描述（中文）' : 'Company Description (Chinese)'}</Label>
            <Textarea value={companyDescZh} onChange={e => setCompanyDescZh(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '公司描述（英文）' : 'Company Description (English)'}</Label>
            <Textarea value={companyDescEn} onChange={e => setCompanyDescEn(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '公司地址（中文）' : 'Address (Chinese)'}</Label>
            <Input value={footerAddressZh} onChange={e => setFooterAddressZh(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{lang === 'zh' ? '公司地址（英文）' : 'Address (English)'}</Label>
            <Input value={footerAddressEn} onChange={e => setFooterAddressEn(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速链接 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{lang === 'zh' ? '快速链接' : 'Quick Links'}</span>
              <Button size="sm" variant="outline" onClick={addQuickLink} className="gap-1.5 h-8">
                <Plus className="size-3.5" />
                {lang === 'zh' ? '添加链接' : 'Add Link'}
              </Button>
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '支持增删改页脚快速链接' : 'Add, edit, or remove footer quick links'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {quickLinks.map((link, idx) => (
              <div key={link.id} className="space-y-2 p-3 border border-border/50 rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeQuickLink(link.id)}
                    className="size-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">{lang === 'zh' ? '中文名称' : 'Label (ZH)'}</Label>
                    <Input
                      size={1}
                      value={link.labelZh}
                      onChange={e => updateQuickLink(link.id, 'labelZh', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{lang === 'zh' ? '英文名称' : 'Label (EN)'}</Label>
                    <Input
                      size={1}
                      value={link.labelEn}
                      onChange={e => updateQuickLink(link.id, 'labelEn', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL</Label>
                  <Input
                    size={1}
                    value={link.url}
                    onChange={e => updateQuickLink(link.id, 'url', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))}
            {quickLinks.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {lang === 'zh' ? '暂无快速链接，点击上方添加' : 'No quick links yet. Click Add above.'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 社交媒体 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{lang === 'zh' ? '社交媒体' : 'Social Media'}</span>
              <Button size="sm" variant="outline" onClick={addSocial} className="gap-1.5 h-8">
                <Plus className="size-3.5" />
                {lang === 'zh' ? '添加账号' : 'Add Account'}
              </Button>
            </CardTitle>
            <CardDescription>
              {lang === 'zh' ? '管理页脚显示的社交媒体账号，支持增删改' : 'Manage social media accounts displayed in footer'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {socials.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg bg-card">
                <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-foreground">
                  <SocialIcon platform={item.platform} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex gap-2">
                    <Select value={item.platform} onValueChange={v => updateSocial(item.id, 'platform', v)}>
                      <SelectTrigger className="h-8 text-sm flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSocial(item.id)}
                      className="size-8 shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <Input
                    value={item.url}
                    onChange={e => updateSocial(item.id, 'url', e.target.value)}
                    className="h-8 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">#{idx + 1}</span>
              </div>
            ))}
            {socials.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {lang === 'zh' ? '暂无社交媒体账号' : 'No social media accounts yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 产品分类展示 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{lang === 'zh' ? '产品分类（自动同步）' : 'Product Categories (Auto-sync)'}</CardTitle>
          <CardDescription>
            {lang === 'zh' ? '产品分类自动同步自后台分类管理，无需单独编辑' : 'Categories are automatically synced from Category Management'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sortedCategories.map(cat => (
              <span key={cat.id} className="px-3 py-1.5 bg-muted text-sm rounded-md">
                {getText(lang, cat.name)}
              </span>
            ))}
            {sortedCategories.length === 0 && (
              <span className="text-sm text-muted-foreground">{lang === 'zh' ? '暂无分类' : 'No categories'}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CTA 区域 + 版权 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{lang === 'zh' ? 'CTA 区域文字' : 'CTA Section Text'}</CardTitle>
            <CardDescription>
              {lang === 'zh' ? '页脚"获取最新报价"区域的标题和描述' : 'Title and description for the "Get Latest Quotes" section'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '标题（中文）' : 'Title (Chinese)'}</Label>
              <Input value={ctaTitleZh} onChange={e => setCtaTitleZh(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '标题（英文）' : 'Title (English)'}</Label>
              <Input value={ctaTitleEn} onChange={e => setCtaTitleEn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '描述（中文）' : 'Description (Chinese)'}</Label>
              <Textarea value={ctaDescZh} onChange={e => setCtaDescZh(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '描述（英文）' : 'Description (English)'}</Label>
              <Textarea value={ctaDescEn} onChange={e => setCtaDescEn(e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{lang === 'zh' ? '版权信息' : 'Copyright'}</CardTitle>
            <CardDescription>
              {lang === 'zh' ? '使用 {year} 占位符表示当前年份' : 'Use {year} placeholder for current year'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '版权文字（中文）' : 'Copyright Text (Chinese)'}</Label>
              <Input value={copyrightZh} onChange={e => setCopyrightZh(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'zh' ? '版权文字（英文）' : 'Copyright Text (English)'}</Label>
              <Input value={copyrightEn} onChange={e => setCopyrightEn(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 恢复确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认页脚设置？' : 'Reset footer settings to default?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '将恢复为系统默认的页脚内容，所有自定义设置将被清除。'
                : 'This will revert to the default footer content. All custom settings will be cleared.'}
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
