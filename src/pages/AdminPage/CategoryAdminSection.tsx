import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, RotateCcw, FolderTree, GripVertical } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLang, getText } from '@/context/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import { MOCK_PRODUCTS } from '@/data/products';
import type { ICategory } from '@/data/categories';

interface FormState {
  icon: string;
  nameZh: string;
  nameEn: string;
}

const emptyForm: FormState = { icon: '⚡', nameZh: '', nameEn: '' };

export default function CategoryAdminSection() {
  const { lang } = useLang();
  const { categories, addCategory, updateCategory, deleteCategory, moveCategory, resetCategories } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const getProductCount = (catId: string) => {
    return MOCK_PRODUCTS.filter(p => p.category === catId).length;
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (c: ICategory) => {
    setEditId(c.id);
    setForm({
      icon: c.icon,
      nameZh: c.name.zh,
      nameEn: c.name.en,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nameZh.trim() && !form.nameEn.trim()) {
      toast.error(lang === 'zh' ? '请至少填写一个分类名称' : 'Please fill in at least one name');
      return;
    }
    if (editId) {
      updateCategory(editId, {
        icon: form.icon,
        name: { zh: form.nameZh, en: form.nameEn },
      });
      toast.success(lang === 'zh' ? '分类已更新' : 'Category updated');
    } else {
      addCategory({
        icon: form.icon,
        name: { zh: form.nameZh, en: form.nameEn },
      });
      toast.success(lang === 'zh' ? '分类已添加' : 'Category added');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCategory(deleteId);
      toast.success(lang === 'zh' ? '分类已删除' : 'Category deleted');
      setDeleteId(null);
    }
  };

  const handleReset = () => {
    resetCategories();
    toast.success(lang === 'zh' ? '已恢复默认分类' : 'Default categories restored');
    setResetOpen(false);
  };

  const sortedCats = [...categories].sort((a, b) => a.order - b.order);
  const catToDelete = deleteId ? categories.find(c => c.id === deleteId) : null;
  const deleteProductCount = catToDelete ? getProductCount(catToDelete.id) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '分类管理' : 'Category Management'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '管理产品分类，支持增删改和排序，修改后前台立即更新' : 'Manage product categories with full CRUD and reorder'}
            {' '}({categories.length})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
            <RotateCcw className="size-4" />
            {lang === 'zh' ? '恢复默认' : 'Reset'}
          </Button>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="size-4" />
            {lang === 'zh' ? '新增分类' : 'Add Category'}
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap w-14">{lang === 'zh' ? '排序' : 'Order'}</TableHead>
                  <TableHead className="whitespace-nowrap w-20">{lang === 'zh' ? '图标' : 'Icon'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '中文名称' : 'Name (Chinese)'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '英文名称' : 'Name (English)'}</TableHead>
                  <TableHead className="whitespace-nowrap">{lang === 'zh' ? '关联产品数' : 'Products'}</TableHead>
                  <TableHead className="whitespace-nowrap text-right">{lang === 'zh' ? '操作' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      {lang === 'zh' ? '暂无分类' : 'No categories'}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedCats.map((c, idx) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GripVertical className="size-4 text-muted-foreground" />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCategory(c.id, 'up')}
                            disabled={idx === 0}
                            className="size-7"
                            aria-label={lang === 'zh' ? '上移' : 'Move up'}
                          >
                            <ArrowUp className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCategory(c.id, 'down')}
                            disabled={idx === sortedCats.length - 1}
                            className="size-7"
                            aria-label={lang === 'zh' ? '下移' : 'Move down'}
                          >
                            <ArrowDown className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                          {c.icon}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{c.name.zh}</TableCell>
                      <TableCell>{c.name.en}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getProductCount(c.id)}</Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                          aria-label={lang === 'zh' ? '编辑' : 'Edit'}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(c.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editId ? (lang === 'zh' ? '编辑分类' : 'Edit Category') : (lang === 'zh' ? '新增分类' : 'Add Category')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>{lang === 'zh' ? '图标（Emoji或图片URL）' : 'Icon (Emoji or image URL)'}</Label>
              <Input
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="⚡ 或 https://..."
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'zh' ? '输入单个Emoji（如 ⚡🔋🚗）或图片URL' : 'Enter a single emoji (e.g. ⚡🔋🚗) or an image URL'}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>{lang === 'zh' ? '中文名称' : 'Name (Chinese)'}</Label>
              <Input
                value={form.nameZh}
                onChange={e => setForm(f => ({ ...f, nameZh: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{lang === 'zh' ? '英文名称' : 'Name (English)'}</Label>
              <Input
                value={form.nameEn}
                onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
              />
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
            <AlertDialogTitle>{lang === 'zh' ? '确认删除分类？' : 'Confirm delete category?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteProductCount > 0
                ? (lang === 'zh'
                    ? `该分类下有 ${deleteProductCount} 个产品，删除后这些产品将变为未分类。`
                    : `This category has ${deleteProductCount} products. They will become uncategorized after deletion.`)
                : (lang === 'zh'
                    ? '删除后无法恢复，确定要删除这个分类吗？'
                    : 'This cannot be undone. Are you sure you want to delete this category?')}
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
            <AlertDialogTitle>{lang === 'zh' ? '恢复默认分类？' : 'Restore default categories?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '所有自定义分类将被替换为预置分类，确定要恢复吗？'
                : 'All custom categories will be replaced with defaults. Continue?'}
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
