import { useState } from 'react';
import { Save, RotateCcw, ToggleLeft, ToggleRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useLang } from '@/context/LanguageContext';
import { useAboutContent } from '@/hooks/useAboutContent';

export default function AboutAdminSection() {
  const { lang } = useLang();
  const { content, updateContent, resetContent, isAboutEnabled, updateAboutEnabled } = useAboutContent();
  const [resetOpen, setResetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'advantages' | 'process'>('intro');

  // 公司介绍
  const [sloganZh, setSloganZh] = useState(content.slogan.zh);
  const [sloganEn, setSloganEn] = useState(content.slogan.en);
  const [descZh, setDescZh] = useState(content.description.zh);
  const [descEn, setDescEn] = useState(content.description.en);

  // 核心优势
  const [advantages, setAdvantages] = useState(content.advantages);

  // 合作流程
  const [processSteps, setProcessSteps] = useState(content.process);

  const handleSaveIntro = () => {
    updateContent({
      slogan: { zh: sloganZh, en: sloganEn },
      description: { zh: descZh, en: descEn },
    });
    toast.success(lang === 'zh' ? '公司介绍已保存' : 'Intro saved');
  };

  const handleSaveAdvantages = () => {
    updateContent({ advantages });
    toast.success(lang === 'zh' ? '核心优势已保存' : 'Advantages saved');
  };

  const handleSaveProcess = () => {
    updateContent({ process: processSteps });
    toast.success(lang === 'zh' ? '合作流程已保存' : 'Process steps saved');
  };

  const handleToggleAbout = (enabled: boolean) => {
    updateAboutEnabled(enabled);
    toast.success(enabled
      ? (lang === 'zh' ? 'About页面已发布' : 'About page published')
      : (lang === 'zh' ? 'About页面已取消发布' : 'About page unpublished'));
  };

  const handleReset = () => {
    resetContent();
    toast.success(lang === 'zh' ? '已恢复默认内容' : 'Reset to default');
    setResetOpen(false);
  };

  // 优势项操作
  const updateAdvantage = (idx: number, field: string, value: string) => {
    setAdvantages(prev => prev.map((a, i) => {
      if (i !== idx) return a;
      if (field === 'icon') return { ...a, icon: value };
      if (field === 'titleZh') return { ...a, title: { ...a.title, zh: value } };
      if (field === 'titleEn') return { ...a, title: { ...a.title, en: value } };
      if (field === 'descZh') return { ...a, description: { ...a.description, zh: value } };
      if (field === 'descEn') return { ...a, description: { ...a.description, en: value } };
      return a;
    }));
  };

  const addAdvantage = () => {
    setAdvantages(prev => [...prev, {
      icon: '✓',
      title: { zh: '新优势', en: 'New Advantage' },
      description: { zh: '优势描述', en: 'Description' },
    }]);
  };

  const removeAdvantage = (idx: number) => {
    setAdvantages(prev => prev.filter((_, i) => i !== idx));
  };

  // 流程步骤操作
  const updateStep = (idx: number, field: string, value: string) => {
    setProcessSteps(prev => prev.map((s, i) => {
      if (i !== idx) return s;
      if (field === 'titleZh') return { ...s, title: { ...s.title, zh: value } };
      if (field === 'titleEn') return { ...s, title: { ...s.title, en: value } };
      if (field === 'descZh') return { ...s, description: { ...s.description, zh: value } };
      if (field === 'descEn') return { ...s, description: { ...s.description, en: value } };
      return s;
    }));
  };

  const addStep = () => {
    setProcessSteps(prev => [...prev, {
      step: prev.length + 1,
      title: { zh: '新步骤', en: 'New Step' },
      description: { zh: '步骤描述', en: 'Description' },
    }]);
  };

  const removeStep = (idx: number) => {
    setProcessSteps(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '关于页面管理' : 'About Page Management'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '编辑About页面内容，修改后前台立即生效' : 'Edit About page content, changes apply instantly'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-card">
            {isAboutEnabled ? (
              <ToggleRight className="size-5 text-emerald-600" />
            ) : (
              <ToggleLeft className="size-5 text-muted-foreground" />
            )}
            <span className="text-sm">
              {isAboutEnabled
                ? (lang === 'zh' ? '已发布' : 'Published')
                : (lang === 'zh' ? '未发布' : 'Unpublished')}
            </span>
          </div>
          <Switch checked={isAboutEnabled} onCheckedChange={handleToggleAbout} />
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
            <RotateCcw className="size-4" />
            {lang === 'zh' ? '恢复默认' : 'Reset'}
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="border-b border-border/40 px-4 pt-2">
            <Tabs defaultValue="intro" value={activeTab} onValueChange={v => setActiveTab(v as typeof activeTab)}>
              <TabsList className="mb-0">
                <TabsTrigger value="intro">{lang === 'zh' ? '公司介绍' : 'Intro'}</TabsTrigger>
                <TabsTrigger value="advantages">{lang === 'zh' ? '核心优势' : 'Advantages'}</TabsTrigger>
                <TabsTrigger value="process">{lang === 'zh' ? '合作流程' : 'Process'}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'intro' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{lang === 'zh' ? '中文Slogan' : 'Slogan (Chinese)'}</Label>
                    <Input value={sloganZh} onChange={e => setSloganZh(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{lang === 'zh' ? '英文Slogan' : 'Slogan (English)'}</Label>
                    <Input value={sloganEn} onChange={e => setSloganEn(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{lang === 'zh' ? '中文公司介绍' : 'Description (Chinese)'}</Label>
                    <Textarea rows={10} value={descZh} onChange={e => setDescZh(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{lang === 'zh' ? '英文公司介绍' : 'Description (English)'}</Label>
                    <Textarea rows={10} value={descEn} onChange={e => setDescEn(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleSaveIntro} className="gap-1.5">
                  <Save className="size-4" />
                  {lang === 'zh' ? '保存公司介绍' : 'Save Intro'}
                </Button>
              </div>
            )}

            {activeTab === 'advantages' && (
              <div className="space-y-4">
                {advantages.map((adv, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {lang === 'zh' ? `优势项 ${idx + 1}` : `Advantage ${idx + 1}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdvantage(idx)}
                          className="text-destructive h-7 px-2"
                        >
                          <Trash2 className="size-3.5 mr-1" />
                          {lang === 'zh' ? '删除' : 'Delete'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{lang === 'zh' ? '图标(Emoji或图标名)' : 'Icon (Emoji or name)'}</Label>
                          <Input value={adv.icon} onChange={e => updateAdvantage(idx, 'icon', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{lang === 'zh' ? '中文标题' : 'Title (Zh)'}</Label>
                          <Input value={adv.title.zh} onChange={e => updateAdvantage(idx, 'titleZh', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{lang === 'zh' ? '英文标题' : 'Title (En)'}</Label>
                          <Input value={adv.title.en} onChange={e => updateAdvantage(idx, 'titleEn', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label>{lang === 'zh' ? '中文描述' : 'Description (Zh)'}</Label>
                          <Input value={adv.description.zh} onChange={e => updateAdvantage(idx, 'descZh', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label>{lang === 'zh' ? '英文描述' : 'Description (En)'}</Label>
                          <Input value={adv.description.en} onChange={e => updateAdvantage(idx, 'descEn', e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" onClick={addAdvantage} className="w-full gap-1.5">
                  <Plus className="size-4" />
                  {lang === 'zh' ? '添加优势项' : 'Add Advantage'}
                </Button>
                <Button onClick={handleSaveAdvantages} className="gap-1.5">
                  <Save className="size-4" />
                  {lang === 'zh' ? '保存所有优势' : 'Save All Advantages'}
                </Button>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="space-y-4">
                {processSteps.map((step, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {lang === 'zh' ? `步骤 ${step.step}` : `Step ${step.step}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(idx)}
                          className="text-destructive h-7 px-2"
                        >
                          <Trash2 className="size-3.5 mr-1" />
                          {lang === 'zh' ? '删除' : 'Delete'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{lang === 'zh' ? '中文标题' : 'Title (Zh)'}</Label>
                          <Input value={step.title.zh} onChange={e => updateStep(idx, 'titleZh', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{lang === 'zh' ? '英文标题' : 'Title (En)'}</Label>
                          <Input value={step.title.en} onChange={e => updateStep(idx, 'titleEn', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label>{lang === 'zh' ? '中文描述' : 'Description (Zh)'}</Label>
                          <Input value={step.description.zh} onChange={e => updateStep(idx, 'descZh', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <Label>{lang === 'zh' ? '英文描述' : 'Description (En)'}</Label>
                          <Input value={step.description.en} onChange={e => updateStep(idx, 'descEn', e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" onClick={addStep} className="w-full gap-1.5">
                  <Plus className="size-4" />
                  {lang === 'zh' ? '添加步骤' : 'Add Step'}
                </Button>
                <Button onClick={handleSaveProcess} className="gap-1.5">
                  <Save className="size-4" />
                  {lang === 'zh' ? '保存所有步骤' : 'Save All Steps'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 恢复确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认内容？' : 'Reset to default content?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '所有自定义About页面内容将被替换为预置内容。'
                : 'All custom About page content will be replaced with defaults.'}
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
