import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, RotateCcw } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLang } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { MOCK_CATEGORIES } from '@/data/categories';
import type { IProduct } from '@/data/products';
import CsvImportSection from './CsvImportSection';

type FormState = {
  nameZh: string;
  nameEn: string;
  category: string;
  priceMin: string;
  priceMax: string;
  moq: string;
  mainImage: string;
  images: string;
  descZh: string;
  descEn: string;
  specs: string;
  featured: boolean;
};

const emptyForm: FormState = {
  nameZh: '',
  nameEn: '',
  category: 'car-gadgets',
  priceMin: '',
  priceMax: '',
  moq: '',
  mainImage: '',
  images: '',
  descZh: '',
  descEn: '',
  specs: '[]',
  featured: false,
};

function productToForm(p: IProduct): FormState {
  return {
    nameZh: p.name.zh,
    nameEn: p.name.en,
    category: p.category,
    priceMin: String(p.priceMin),
    priceMax: String(p.priceMax),
    moq: String(p.moq),
    mainImage: p.mainImage,
    images: p.images.join('\n'),
    descZh: p.description.zh,
    descEn: p.description.en,
    specs: JSON.stringify(p.specs, null, 2),
    featured: !!p.featured,
  };
}

function formToProductInput(f: FormState): Omit<IProduct, 'id' | 'source' | 'createdAt'> {
  let specs: IProduct['specs'] = [];
  try {
    specs = JSON.parse(f.specs);
  } catch {
    specs = [];
  }
  const images = f.images
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  return {
    name: { zh: f.nameZh, en: f.nameEn },
    category: f.category,
    priceMin: Number(f.priceMin) || 0,
    priceMax: Number(f.priceMax) || Number(f.priceMin) || 0,
    moq: Number(f.moq) || 1,
    mainImage: f.mainImage || images[0] || '',
    images: images.length > 0 ? images : [f.mainImage].filter(Boolean),
    description: { zh: f.descZh, en: f.descEn },
    specs,
    featured: f.featured,
  };
}

export default function ProductAdminSection() {
  const { t, lang } = useLang();
  const { products, addProduct, updateProduct, deleteProduct, resetToMock } = useProducts();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterCat !== 'all') list = list.filter(p => p.category === filterCat);
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.zh.toLowerCase().includes(kw) ||
        p.name.en.toLowerCase().includes(kw) ||
        p.id.toLowerCase().includes(kw)
      );
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [products, search, filterCat]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: IProduct) => {
    setEditId(p.id);
    setForm(productToForm(p));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nameZh.trim() && !form.nameEn.trim()) {
      toast.error(lang === 'zh' ? '请至少填写一个名称' : 'Please fill in at least one name');
      return;
    }
    const input = formToProductInput(form);
    if (editId) {
      updateProduct(editId, input);
      toast.success(t.admin.success.edit);
    } else {
      addProduct(input);
      toast.success(t.admin.success.add);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      toast.success(t.admin.success.delete);
      setDeleteId(null);
    }
  };

  const handleReset = () => {
    resetToMock();
    toast.success(t.admin.success.reset);
    setResetOpen(false);
  };

  const catName = (id: string) =>
    MOCK_CATEGORIES.find(c => c.id === id)?.name[lang as 'zh' | 'en'] || id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t.admin.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t.admin.subtitle} ({products.length} products)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)} className="gap-1.5">
            <RotateCcw className="size-4" />
            {t.admin.resetData}
          </Button>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="size-4" />
            {t.admin.addProduct}
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
              placeholder={t.admin.search}
              className="pl-9"
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.product.allCategories}</SelectItem>
              {MOCK_CATEGORIES
                .sort((a, b) => a.order - b.order)
                .map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name[lang as 'zh' | 'en']}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* CSV 批量导入 */}
      <CsvImportSection />

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-base">
            {lang === 'zh' ? '产品列表' : 'Product List'} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap w-20">{t.admin.table.id}</TableHead>
                  <TableHead className="whitespace-nowrap min-w-[200px]">{t.admin.table.name}</TableHead>
                  <TableHead className="whitespace-nowrap">{t.admin.table.category}</TableHead>
                  <TableHead className="whitespace-nowrap">{t.admin.table.price}</TableHead>
                  <TableHead className="whitespace-nowrap">{t.admin.table.moq}</TableHead>
                  <TableHead className="whitespace-nowrap text-right">{t.admin.table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      {t.product.noProducts}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                      <TableCell className="font-medium">
                        <span className="block truncate max-w-[280px]">
                          {p.name[lang as 'zh' | 'en']}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-muted">
                          {catName(p.category)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        ¥{p.priceMin}{p.priceMax > p.priceMin ? ` - ¥${p.priceMax}` : ''}
                      </TableCell>
                      <TableCell>{p.moq}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(p)}
                          aria-label={t.admin.table.edit}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(p.id)}
                          aria-label={t.admin.table.delete}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? t.admin.editProduct : t.admin.addProduct}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>{t.admin.form.nameZh}</Label>
              <Input value={form.nameZh} onChange={e => setForm(f => ({ ...f, nameZh: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.admin.form.nameEn}</Label>
              <Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.admin.form.category}</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CATEGORIES
                    .sort((a, b) => a.order - b.order)
                    .map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name[lang as 'zh' | 'en']}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 grid grid-cols-2 gap-3">
              <div>
                <Label>{t.admin.form.priceMin}</Label>
                <Input type="number" value={form.priceMin} onChange={e => setForm(f => ({ ...f, priceMin: e.target.value }))} />
              </div>
              <div>
                <Label>{t.admin.form.priceMax}</Label>
                <Input type="number" value={form.priceMax} onChange={e => setForm(f => ({ ...f, priceMax: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t.admin.form.moq}</Label>
              <Input type="number" value={form.moq} onChange={e => setForm(f => ({ ...f, moq: e.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>{t.admin.form.mainImage}</Label>
              <Input value={form.mainImage} onChange={e => setForm(f => ({ ...f, mainImage: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>{t.admin.form.images}</Label>
              <Textarea
                rows={3}
                value={form.images}
                onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                placeholder="https://..."
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>{t.admin.form.descZh}</Label>
              <Textarea rows={3} value={form.descZh} onChange={e => setForm(f => ({ ...f, descZh: e.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>{t.admin.form.descEn}</Label>
              <Textarea rows={3} value={form.descEn} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>{t.admin.form.specs}</Label>
              <Textarea
                rows={6}
                value={form.specs}
                onChange={e => setForm(f => ({ ...f, specs: e.target.value }))}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                JSON 数组格式，例如: {`[{{"label": {"zh": "材质", "en": "Material"}, "value": "ABS"}}]`}
              </p>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Switch
                checked={form.featured}
                onCheckedChange={v => setForm(f => ({ ...f, featured: v }))}
                id="featured"
              />
              <Label htmlFor="featured">{t.admin.form.featured}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t.admin.form.cancel}</Button>
            <Button onClick={handleSave}>{t.admin.form.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin.deleteProduct}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin.confirmDelete}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin.form.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t.admin.table.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirm */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin.resetData}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin.confirmReset}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin.form.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
              {t.admin.resetData}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
