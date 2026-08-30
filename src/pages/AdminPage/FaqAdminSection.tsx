import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { useLang, getText } from '@/context/LanguageContext';
import { useFaqs } from '@/hooks/useFaqs';
import { MOCK_FAQ_CATEGORIES, type IFaqItem } from '@/data/faq';

interface FaqFormState {
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
  category: string;
  order: string;
}

const emptyFaqForm: FaqFormState = {
  questionZh: '',
  questionEn: '',
  answerZh: '',
  answerEn: '',
  category: 'order',
  order: '10',
};

function faqToForm(f: IFaqItem): FaqFormState {
  return {
    questionZh: f.question.zh,
    questionEn: f.question.en,
    answerZh: f.answer.zh,
    answerEn: f.answer.en,
    category: f.category,
    order: String(f.order),
  };
}

function formToFaqInput(f: FaqFormState): Omit<IFaqItem, 'id' | 'createdAt' | 'source'> {
  return {
    question: { zh: f.questionZh, en: f.questionEn },
    answer: { zh: f.answerZh, en: f.answerEn },
    category: f.category,
    order: Number(f.order) || 10,
  };
}

export default function FaqAdminSection() {
  const { lang } = useLang();
  const { faqs, addFaq, updateFaq, deleteFaq, resetFaqs } = useFaqs();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FaqFormState>(emptyFaqForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...faqs];
    if (filterCat !== 'all') list = list.filter(f => f.category === filterCat);
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(f =>
        f.question.zh.toLowerCase().includes(kw) ||
        f.question.en.toLowerCase().includes(kw) ||
        f.answer.zh.toLowerCase().includes(kw) ||
        f.answer.en.toLowerCase().includes(kw)
      );
    }
    return list.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.order - b.order;
    });
  }, [faqs, search, filterCat]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyFaqForm);
    setDialogOpen(true);
  };

  const openEdit = (f: IFaqItem) => {
    setEditId(f.id);
    setForm(faqToForm(f));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.questionZh.trim() && !form.questionEn.trim()) {
      toast.error(lang === 'zh' ? '请至少填写一个问题' : 'Please fill in at least one question');
      return;
    }
    const input = formToFaqInput(form);
    if (editId) {
      updateFaq(editId, input);
      toast.success(lang === 'zh' ? 'FAQ已更新' : 'FAQ updated');
    } else {
      addFaq(input);
      toast.success(lang === 'zh' ? 'FAQ已添加' : 'FAQ added');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteFaq(deleteId);
      toast.success(lang === 'zh' ? 'FAQ已删除' : 'FAQ deleted');
      setDeleteId(null);
    }
  };

  const handleReset = () => {
    resetFaqs();
    toast.success(lang === 'zh' ? '已恢复默认数据' : 'Default data restored');
    setResetOpen(false);
  };

  const moveOrder = (id: string, direction: 'up' | 'down') => {
    const sameCat = filtered.filter(f => f.category === faqs.find(fa => fa.id === id)?.category);
    const idx = sameCat.findIndex(f => f.id === id);
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= sameCat.length) return;
    const currentOrder = sameCat[idx].order;
    const targetOrder = sameCat[target].order;
    updateFaq(id, { order: targetOrder });
    updateFaq(sameCat[target].id, { order: currentOrder });
  };

  const catName = (id: string) =>
    MOCK_FAQ_CATEGORIES.find(c => c.id === id)?.name[lang as 'zh' | 'en'] || id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? 'FAQ管理' : 'FAQ Management'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '管理常见问题和答案' : 'Manage frequently asked questions'} ({faqs.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
            <RotateCcw className="size-4" />
            {lang === 'zh' ? '恢复默认' : 'Reset'}
          </Button>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="size-4" />
            {lang === 'zh' ? '新增FAQ' : 'Add FAQ'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'zh' ? '搜索问题或答案...' : 'Search questions or answers...'}
              className="pl-9"
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'zh' ? '全部分类' : 'All categories'}</SelectItem>
              {MOCK_FAQ_CATEGORIES
                .sort((a, b) => a.order - b.order)
                .map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {getText(lang, c.name)}
                  </SelectItem>
                ))}
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
                  <TableHead className="whitespace-nowrap w-20">{lang === 'zh' ? 'ID' : 'ID'}</TableHead>
                  <TableHead className="whitespace-nowrap min-w-[280px]">{lang === 'zh' ? '问题' : 'Question'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '分类' : 'Category'}</TableHead>
                  <TableHead className="whitespace-nowrap w-20">{lang === 'zh' ? '排序' : 'Order'}</TableHead>
                  <TableHead className="whitespace-nowrap text-right">{lang === 'zh' ? '操作' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      {lang === 'zh' ? '暂无FAQ' : 'No FAQs'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(f => (
                    <TableRow key={f.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{f.id}</TableCell>
                      <TableCell className="font-medium">
                        <span className="block truncate max-w-[360px]">
                          {f.question[lang as 'zh' | 'en']}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{catName(f.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveOrder(f.id, 'up')}
                            aria-label={lang === 'zh' ? '上移' : 'Move up'}
                          >
                            <ArrowUp className="size-3.5" />
                          </Button>
                          <span className="text-xs text-muted-foreground w-6 text-center">{f.order}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveOrder(f.id, 'down')}
                            aria-label={lang === 'zh' ? '下移' : 'Move down'}
                          >
                            <ArrowDown className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(f)}
                          aria-label={lang === 'zh' ? '编辑' : 'Edit'}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(f.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? (lang === 'zh' ? '编辑FAQ' : 'Edit FAQ') : (lang === 'zh' ? '新增FAQ' : 'Add FAQ')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '问题（中文）' : 'Question (Chinese)'}</Label>
                <Input
                  value={form.questionZh}
                  onChange={e => setForm(f => ({ ...f, questionZh: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '问题（英文）' : 'Question (English)'}</Label>
                <Input
                  value={form.questionEn}
                  onChange={e => setForm(f => ({ ...f, questionEn: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '分类' : 'Category'}</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_FAQ_CATEGORIES.sort((a, b) => a.order - b.order).map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {getText(lang, c.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '排序' : 'Order'}</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '答案（中文）' : 'Answer (Chinese)'}</Label>
                <Textarea
                  rows={6}
                  value={form.answerZh}
                  onChange={e => setForm(f => ({ ...f, answerZh: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{lang === 'zh' ? '答案（英文）' : 'Answer (English)'}</Label>
                <Textarea
                  rows={6}
                  value={form.answerEn}
                  onChange={e => setForm(f => ({ ...f, answerEn: e.target.value }))}
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

      {/* 删除确认 */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '确认删除？' : 'Confirm deletion?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '删除后无法恢复，确定要删除这条FAQ吗？'
                : 'This cannot be undone. Are you sure you want to delete this FAQ?'}
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
                ? '所有自定义FAQ将被替换为预置示例，确定要恢复吗？'
                : 'All custom FAQs will be replaced with preset examples. Continue?'}
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
