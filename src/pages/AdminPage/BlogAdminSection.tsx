import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, RotateCcw, Calendar, User, Clock, Upload, FileJson, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useLang, getText } from '@/context/LanguageContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { MOCK_BLOG_CATEGORIES, type IBlogPost } from '@/data/blog';

type BlogStatus = 'published' | 'draft' | 'scheduled';

interface BlogFormState {
  titleZh: string;
  titleEn: string;
  category: string;
  coverImage: string;
  author: string;
  summaryZh: string;
  summaryEn: string;
  contentZh: string;
  contentEn: string;
  publishDate: string;
  status: BlogStatus;
  scheduledDateTime: string; // datetime-local格式
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'file' | '';
}

const emptyBlogForm: BlogFormState = {
  titleZh: '',
  titleEn: '',
  category: 'industry',
  coverImage: '',
  author: '',
  summaryZh: '',
  summaryEn: '',
  contentZh: '',
  contentEn: '',
  publishDate: new Date().toISOString().split('T')[0],
  status: 'published',
  scheduledDateTime: '',
  videoUrl: '',
  videoType: '',
};

function blogToForm(b: IBlogPost): BlogFormState {
  const status: BlogStatus = (b.status as BlogStatus) || 'published';
  let scheduledDateTime = '';
  if (b.scheduledAt) {
    const d = new Date(b.scheduledAt);
    const pad = (n: number) => String(n).padStart(2, '0');
    scheduledDateTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return {
    titleZh: b.title.zh,
    titleEn: b.title.en,
    category: b.category,
    coverImage: b.coverImage,
    author: b.author,
    summaryZh: b.summary.zh,
    summaryEn: b.summary.en,
    contentZh: b.content.zh,
    contentEn: b.content.en,
    publishDate: b.publishDate,
    status,
    scheduledDateTime,
    videoUrl: b.videoUrl || '',
    videoType: b.videoType || '',
  };
}

function formToBlogInput(f: BlogFormState): Omit<IBlogPost, 'id' | 'createdAt' | 'source' | 'views'> & { status?: BlogStatus; scheduledAt?: number } {
  const result: Omit<IBlogPost, 'id' | 'createdAt' | 'source' | 'views'> & { status?: BlogStatus; scheduledAt?: number } = {
    title: { zh: f.titleZh, en: f.titleEn },
    category: f.category,
    coverImage: f.coverImage,
    author: f.author,
    summary: { zh: f.summaryZh, en: f.summaryEn },
    content: { zh: f.contentZh, en: f.contentEn },
    publishDate: f.publishDate,
    status: f.status,
  };
  if (f.videoUrl.trim()) {
    result.videoUrl = f.videoUrl.trim();
    result.videoType = f.videoType || undefined;
  }
  if (f.status === 'scheduled' && f.scheduledDateTime) {
    result.scheduledAt = new Date(f.scheduledDateTime).getTime();
  }
  return result;
}

const BULK_TEMPLATE = `[
  {
    "title": { "zh": "文章标题1", "en": "Article Title 1" },
    "category": "industry",
    "coverImage": "https://example.com/img1.jpg",
    "author": "Author Name",
    "summary": { "zh": "摘要1", "en": "Summary 1" },
    "content": { "zh": "正文内容1", "en": "Content 1" },
    "publishDate": "2025-01-01",
    "status": "published"
  },
  {
    "title": { "zh": "定时发布文章", "en": "Scheduled Article" },
    "category": "guide",
    "coverImage": "",
    "author": "Author Name",
    "summary": { "zh": "定时发布示例", "en": "Scheduled example" },
    "content": { "zh": "正文内容", "en": "Content" },
    "publishDate": "2025-12-31",
    "status": "scheduled",
    "scheduledAt": 1767225600000
  }
]`;

export default function BlogAdminSection() {
  const { lang } = useLang();
  const { posts, addPost, bulkAddPosts, updatePost, deletePost, resetPosts } = useBlogPosts();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | BlogStatus>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyBlogForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkResult, setBulkResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const filtered = useMemo(() => {
    let list = [...posts];
    if (filterCat !== 'all') list = list.filter(p => p.category === filterCat);
    if (filterStatus !== 'all') list = list.filter(p => (p.status || 'published') === filterStatus);
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(p =>
        p.title.zh.toLowerCase().includes(kw) ||
        p.title.en.toLowerCase().includes(kw) ||
        p.id.toLowerCase().includes(kw)
      );
    }
    return list.sort((a, b) => {
      // scheduled按定时时间排，其他按发布日期排
      const aTime = a.status === 'scheduled' && a.scheduledAt ? a.scheduledAt : new Date(a.publishDate).getTime();
      const bTime = b.status === 'scheduled' && b.scheduledAt ? b.scheduledAt : new Date(b.publishDate).getTime();
      return bTime - aTime;
    });
  }, [posts, search, filterCat, filterStatus]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyBlogForm);
    setDialogOpen(true);
  };

  const openEdit = (b: IBlogPost) => {
    setEditId(b.id);
    setForm(blogToForm(b));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.titleZh.trim() && !form.titleEn.trim()) {
      toast.error(lang === 'zh' ? '请至少填写一个标题' : 'Please fill in at least one title');
      return;
    }
    if (form.status === 'scheduled' && !form.scheduledDateTime) {
      toast.error(lang === 'zh' ? '请设置定时发布时间' : 'Please set scheduled time');
      return;
    }
    const input = formToBlogInput(form);
    if (editId) {
      updatePost(editId, input);
      toast.success(lang === 'zh' ? '文章已更新' : 'Article updated');
    } else {
      addPost(input);
      toast.success(lang === 'zh' ? '文章已添加' : 'Article added');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePost(deleteId);
      toast.success(lang === 'zh' ? '文章已删除' : 'Article deleted');
      setDeleteId(null);
    }
  };

  const handleReset = () => {
    resetPosts();
    toast.success(lang === 'zh' ? '已恢复默认数据' : 'Default data restored');
    setResetOpen(false);
  };

  const handleBulkImport = () => {
    try {
      const data = JSON.parse(bulkJson);
      if (!Array.isArray(data)) {
        toast.error(lang === 'zh' ? 'JSON必须是数组格式' : 'JSON must be an array');
        return;
      }
      const validItems: Omit<IBlogPost, 'id' | 'createdAt' | 'source' | 'views'>[] = [];
      const errors: string[] = [];

      data.forEach((item: unknown, idx: number) => {
        const it = item as Record<string, unknown>;
        if (!it.title || typeof it.title !== 'object') {
          errors.push(`第${idx + 1}条: 缺少title字段`);
          return;
        }
        const title = it.title as Record<string, string>;
        if (!title.zh && !title.en) {
          errors.push(`第${idx + 1}条: title至少需要zh或en`);
          return;
        }
        validItems.push({
          title: { zh: title.zh || '', en: title.en || '' },
          category: typeof it.category === 'string' ? it.category : 'industry',
          coverImage: typeof it.coverImage === 'string' ? it.coverImage : '',
          author: typeof it.author === 'string' ? it.author : 'Admin',
          summary: typeof it.summary === 'object' && it.summary
            ? { zh: (it.summary as Record<string, string>).zh || '', en: (it.summary as Record<string, string>).en || '' }
            : { zh: '', en: '' },
          content: typeof it.content === 'object' && it.content
            ? { zh: (it.content as Record<string, string>).zh || '', en: (it.content as Record<string, string>).en || '' }
            : { zh: '', en: '' },
          publishDate: typeof it.publishDate === 'string' ? it.publishDate : new Date().toISOString().split('T')[0],
          status: (it.status as BlogStatus) || 'published',
          scheduledAt: typeof it.scheduledAt === 'number' ? it.scheduledAt : undefined,
        } as Omit<IBlogPost, 'id' | 'createdAt' | 'source' | 'views'> & { status?: BlogStatus; scheduledAt?: number });
      });

      if (validItems.length > 0) {
        bulkAddPosts(validItems);
      }
      setBulkResult({ success: validItems.length, failed: errors.length, errors });
      toast.success(lang === 'zh'
        ? `批量导入完成：成功${validItems.length}篇，失败${errors.length}篇`
        : `Bulk import complete: ${validItems.length} success, ${errors.length} failed`);
    } catch (e) {
      toast.error(lang === 'zh' ? 'JSON格式错误：' + String(e) : 'JSON parse error: ' + String(e));
    }
  };

  const copyTemplate = () => {
    navigator.clipboard?.writeText(BULK_TEMPLATE);
    toast.success(lang === 'zh' ? '模板已复制' : 'Template copied');
  };

  const catName = (id: string) =>
    MOCK_BLOG_CATEGORIES.find(c => c.id === id)?.name[lang as 'zh' | 'en'] || id;

  const statusLabel = (status?: string) => {
    if (status === 'draft') return lang === 'zh' ? '草稿' : 'Draft';
    if (status === 'scheduled') return lang === 'zh' ? '定时发布' : 'Scheduled';
    return lang === 'zh' ? '已发布' : 'Published';
  };

  const statusVariant = (status?: string) => {
    if (status === 'draft') return 'secondary' as const;
    if (status === 'scheduled') return 'outline' as const;
    return 'default' as const;
  };

  const formatScheduled = (ts?: number) => {
    if (!ts) return '-';
    const d = new Date(ts);
    return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const countByStatus = (status: BlogStatus) =>
    posts.filter(p => (p.status || 'published') === status).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '博客管理' : 'Blog Management'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '管理博客文章（草稿、定时发布、批量上传）' : 'Manage blog articles (drafts, scheduled, bulk upload)'}
            {' '}({posts.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setBulkOpen(true)} className="gap-1.5">
            <Upload className="size-4" />
            {lang === 'zh' ? '批量导入' : 'Bulk Import'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
            <RotateCcw className="size-4" />
            {lang === 'zh' ? '恢复默认' : 'Reset'}
          </Button>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="size-4" />
            {lang === 'zh' ? '新增文章' : 'Add Article'}
          </Button>
        </div>
      </div>

      {/* 状态统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{posts.length}</div>
            <div className="text-xs text-muted-foreground">{lang === 'zh' ? '全部文章' : 'Total'}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{countByStatus('published')}</div>
            <div className="text-xs text-muted-foreground">{lang === 'zh' ? '已发布' : 'Published'}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{countByStatus('draft')}</div>
            <div className="text-xs text-muted-foreground">{lang === 'zh' ? '草稿' : 'Drafts'}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{countByStatus('scheduled')}</div>
            <div className="text-xs text-muted-foreground">{lang === 'zh' ? '定时发布' : 'Scheduled'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
              className="pl-9"
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'zh' ? '全部分类' : 'All categories'}</SelectItem>
              {MOCK_BLOG_CATEGORIES
                .sort((a, b) => a.order - b.order)
                .map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {getText(lang, c.name)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => setFilterStatus(v as BlogStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'zh' ? '全部状态' : 'All status'}</SelectItem>
              <SelectItem value="published">{lang === 'zh' ? '已发布' : 'Published'}</SelectItem>
              <SelectItem value="draft">{lang === 'zh' ? '草稿' : 'Draft'}</SelectItem>
              <SelectItem value="scheduled">{lang === 'zh' ? '定时发布' : 'Scheduled'}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap w-24">{lang === 'zh' ? 'ID' : 'ID'}</TableHead>
                  <TableHead className="whitespace-nowrap min-w-[240px]">{lang === 'zh' ? '标题' : 'Title'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '分类' : 'Category'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '状态' : 'Status'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '发布/定时时间' : 'Publish/Scheduled'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '作者' : 'Author'}</TableHead>
                  <TableHead className="whitespace-nowrap text-right">{lang === 'zh' ? '操作' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {lang === 'zh' ? '暂无文章' : 'No articles'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{b.id}</TableCell>
                      <TableCell className="font-medium">
                        <span className="block truncate max-w-[300px]">
                          {b.title[lang as 'zh' | 'en']}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{catName(b.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(b.status)} className="text-xs gap-1">
                          {b.status === 'scheduled' && <Clock className="size-3" />}
                          {b.status === 'draft' && <XCircle className="size-3" />}
                          {(!b.status || b.status === 'published') && <CheckCircle2 className="size-3" />}
                          {statusLabel(b.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {b.status === 'scheduled' ? formatScheduled(b.scheduledAt) : b.publishDate}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{b.author}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(b)}
                          aria-label={lang === 'zh' ? '编辑' : 'Edit'}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(b.id)}
                          aria-label={lang === 'zh' ? '删除' : 'Delete'}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? (lang === 'zh' ? '编辑文章' : 'Edit Article') : (lang === 'zh' ? '新增文章' : 'Add Article')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '中文标题' : 'Title (Chinese)'}</Label>
                <Input
                  value={form.titleZh}
                  onChange={e => setForm(f => ({ ...f, titleZh: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '英文标题' : 'Title (English)'}</Label>
                <Input
                  value={form.titleEn}
                  onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '分类' : 'Category'}</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BLOG_CATEGORIES.sort((a, b) => a.order - b.order).map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {getText(lang, c.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '作者' : 'Author'}</Label>
                <Input
                  value={form.author}
                  onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '发布日期' : 'Publish Date'}</Label>
                <Input
                  type="date"
                  value={form.publishDate}
                  onChange={e => setForm(f => ({ ...f, publishDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '状态' : 'Status'}</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as BlogStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">{lang === 'zh' ? '已发布' : 'Published'}</SelectItem>
                    <SelectItem value="draft">{lang === 'zh' ? '草稿' : 'Draft'}</SelectItem>
                    <SelectItem value="scheduled">{lang === 'zh' ? '定时发布' : 'Scheduled'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.status === 'scheduled' && (
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '定时发布时间' : 'Scheduled Time'}</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledDateTime}
                  onChange={e => setForm(f => ({ ...f, scheduledDateTime: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  {lang === 'zh'
                    ? '到设定时间后文章将自动从草稿变为已发布（页面保持打开时每分钟检查一次）'
                    : 'Article will auto-publish at the set time (checked every minute while page is open)'}
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{lang === 'zh' ? '封面图 URL' : 'Cover Image URL'}</Label>
              <Input
                value={form.coverImage}
                onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label>{lang === 'zh' ? '视频 URL（可选，支持 YouTube/Vimeo/视频文件）' : 'Video URL (optional, YouTube/Vimeo/file)'}</Label>
                <Input
                  value={form.videoUrl}
                  onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                  placeholder={lang === 'zh' ? 'https://www.youtube.com/watch?v=...' : 'https://www.youtube.com/watch?v=...'}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '视频类型' : 'Video Type'}</Label>
                <Select
                  value={form.videoType}
                  onValueChange={v => setForm(f => ({ ...f, videoType: v as BlogFormState['videoType'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={lang === 'zh' ? '自动检测' : 'Auto detect'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{lang === 'zh' ? '自动检测' : 'Auto detect'}</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="file">{lang === 'zh' ? '视频文件' : 'Video File'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.videoUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-black border border-border">
                <VideoPreview url={form.videoUrl} type={form.videoType} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '中文摘要' : 'Summary (Chinese)'}</Label>
                <Textarea
                  rows={3}
                  value={form.summaryZh}
                  onChange={e => setForm(f => ({ ...f, summaryZh: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '英文摘要' : 'Summary (English)'}</Label>
                <Textarea
                  rows={3}
                  value={form.summaryEn}
                  onChange={e => setForm(f => ({ ...f, summaryEn: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '中文正文（##小标题，-列表，空行分段）' : 'Content (Chinese)'}</Label>
                <Textarea
                  rows={10}
                  className="font-mono text-xs"
                  value={form.contentZh}
                  onChange={e => setForm(f => ({ ...f, contentZh: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '英文正文' : 'Content (English)'}</Label>
                <Textarea
                  rows={10}
                  className="font-mono text-xs"
                  value={form.contentEn}
                  onChange={e => setForm(f => ({ ...f, contentEn: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {lang === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleSave}>
              {lang === 'zh' ? '保存' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量导入对话框 */}
      <Dialog open={bulkOpen} onOpenChange={o => { setBulkOpen(o); if (!o) { setBulkResult(null); setBulkJson(''); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {lang === 'zh' ? '批量导入文章' : 'Bulk Import Articles'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <Label>{lang === 'zh' ? 'JSON 数据（数组格式，每篇文章一个对象）' : 'JSON Data (array format)'}</Label>
              <Button variant="outline" size="sm" onClick={copyTemplate} className="gap-1.5 h-7">
                <Copy className="size-3.5" />
                {lang === 'zh' ? '复制模板' : 'Copy Template'}
              </Button>
            </div>
            <Textarea
              rows={14}
              className="font-mono text-xs"
              value={bulkJson}
              onChange={e => setBulkJson(e.target.value)}
              placeholder={lang === 'zh' ? '粘贴JSON数组...' : 'Paste JSON array...'}
            />
            <p className="text-xs text-muted-foreground">
              {lang === 'zh'
                ? '支持字段: title({zh,en}), category, coverImage, author, summary({zh,en}), content({zh,en}), publishDate, status(published/draft/scheduled), scheduledAt(时间戳)'
                : 'Supported fields: title({zh,en}), category, coverImage, author, summary({zh,en}), content({zh,en}), publishDate, status, scheduledAt(timestamp)'}
            </p>
            {bulkResult && (
              <div className={`p-3 rounded-lg text-sm ${bulkResult.failed === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                <div className="font-medium mb-1">
                  {lang === 'zh' ? '导入结果' : 'Import Result'}: {bulkResult.success} {lang === 'zh' ? '成功' : 'success'}, {bulkResult.failed} {lang === 'zh' ? '失败' : 'failed'}
                </div>
                {bulkResult.errors.length > 0 && (
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    {bulkResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              {lang === 'zh' ? '关闭' : 'Close'}
            </Button>
            <Button onClick={handleBulkImport} className="gap-1.5">
              <FileJson className="size-4" />
              {lang === 'zh' ? '导入' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '确认删除？' : 'Confirm deletion?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '删除后无法恢复，确定要删除这篇文章吗？'
                : 'This cannot be undone. Are you sure you want to delete this article?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'zh' ? '取消' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {lang === 'zh' ? '删除' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 恢复确认 */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认数据？' : 'Restore default data?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '所有自定义文章将被替换为预置示例文章，确定要恢复吗？'
                : 'All custom articles will be replaced with preset examples. Continue?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'zh' ? '取消' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              {lang === 'zh' ? '恢复' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 视频预览组件（后台编辑用）
function VideoPreview({ url, type }: { url: string; type?: string }) {
  const detectedType = type || detectVideoType(url);

  if (detectedType === 'youtube') {
    const videoId = extractYouTubeId(url);
    if (!videoId) return <VideoPreviewFallback url={url} />;
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (detectedType === 'vimeo') {
    const videoId = extractVimeoId(url);
    if (!videoId) return <VideoPreviewFallback url={url} />;
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video src={url} controls className="w-full h-full object-contain">
      您的浏览器不支持视频播放。
    </video>
  );
}

function VideoPreviewFallback({ url }: { url: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
      <p className="text-xs text-muted-foreground">无法自动解析视频链接，请保存后在前台查看</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">
        {url}
      </a>
    </div>
  );
}

function detectVideoType(url: string): 'youtube' | 'vimeo' | 'file' {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  return 'file';
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}
