import { useState, useRef, useCallback } from 'react';
import { Upload, Download, FileSpreadsheet, Check, AlertCircle, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
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
import { useProducts } from '@/hooks/useProducts';
import type { IProduct } from '@/data/products';

type ImportMode = 'append' | 'overwrite';
type ParsedRow = Partial<IProduct> & { _error?: string; _rowIndex?: number };

const CSV_TEMPLATE = [
  ['nameZh', 'nameEn', 'category', 'priceMin', 'priceMax', 'moq', 'mainImage', 'images', 'descZh', 'descEn', 'specsJson', 'skusJson'],
  ['GBT 32A Charging Gun', 'GBT 32A Charging Gun', 'charging-guns', '18', '35', '2', 'https://example.com/main.jpg', 'https://example.com/1.jpg;https://example.com/2.jpg', '产品描述', 'Product description', '[{"label":{"zh":"材质","en":"Material"},"value":"Thermoplastic"}]', '[{"id":"s1","name":{"zh":"黑色","en":"Black"},"price":18,"stock":100}]'],
];

function arrayToCsv(rows: (string | number)[][]): string {
  return rows.map(row =>
    row.map(cell => {
      const s = String(cell ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    }).join(',')
  ).join('\n');
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        currentRow.push(currentCell);
        currentCell = '';
      } else if (ch === '\n') {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else if (ch === '\r') {
        // skip
      } else {
        currentCell += ch;
      }
    }
  }
  // 处理最后一行
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  // 过滤完全空的行
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

export default function CsvImportSection() {
  const { t, lang } = useLang();
  const { products, addProduct, replaceAllProducts } = useProducts();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>('append');
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const validRows = parsedRows.filter(r => !r._error);

  const handleDownloadTemplate = useCallback(() => {
    const csv = arrayToCsv(CSV_TEMPLATE);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youpei-auto-products-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(lang === 'zh' ? '模板已下载' : 'Template downloaded');
  }, [lang]);

  const parseFile = async (file: File): Promise<ParsedRow[]> => {
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.trim());
    const dataRows = rows.slice(1);

    const colIndex = (name: string) => headers.indexOf(name);

    const parsed: ParsedRow[] = dataRows.map((row, idx) => {
      const nameZh = row[colIndex('nameZh')] || '';
      const nameEn = row[colIndex('nameEn')] || '';
      const category = row[colIndex('category')] || '';
      const priceMin = Number(row[colIndex('priceMin')]) || 0;
      const priceMax = Number(row[colIndex('priceMax')]) || priceMin;
      const moq = Number(row[colIndex('moq')]) || 1;
      const mainImage = row[colIndex('mainImage')] || '';
      const imagesStr = row[colIndex('images')] || '';
      const images = imagesStr.split(';').map(s => s.trim()).filter(Boolean);
      const descZh = row[colIndex('descZh')] || '';
      const descEn = row[colIndex('descEn')] || '';
      const specsStr = row[colIndex('specsJson')] || '[]';
      const skusStr = row[colIndex('skusJson')] || '';

      // 验证
      const errors: string[] = [];
      if (!nameZh && !nameEn) errors.push(lang === 'zh' ? '名称不能为空' : 'Name required');
      if (!category) errors.push(lang === 'zh' ? '分类不能为空' : 'Category required');

      let specs: IProduct['specs'] = [];
      try {
        if (specsStr.trim()) specs = JSON.parse(specsStr);
      } catch {
        errors.push(lang === 'zh' ? '规格参数JSON无效' : 'Invalid specs JSON');
      }

      let skus: IProduct['skus'] = undefined;
      if (skusStr.trim()) {
        try {
          skus = JSON.parse(skusStr);
        } catch {
          errors.push(lang === 'zh' ? 'SKU JSON无效' : 'Invalid SKU JSON');
        }
      }

      const allImages = images.length > 0 ? images : [mainImage].filter(Boolean);

      const result: ParsedRow = {
        _rowIndex: idx + 2,
        name: { zh: nameZh, en: nameEn },
        category,
        priceMin,
        priceMax: priceMax || priceMin,
        moq,
        mainImage: mainImage || allImages[0] || '',
        images: allImages,
        description: { zh: descZh, en: descEn },
        specs,
        skus,
        featured: false,
      };

      if (errors.length > 0) {
        result._error = errors.join('; ');
      }
      return result;
    });

    return parsed;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setProgress(0);
    setIsImporting(false);

    try {
      setProgress(10);
      const rows = await parseFile(file);
      setProgress(80);
      setParsedRows(rows);
      setErrorCount(rows.filter(r => r._error).length);
      setProgress(100);
    } catch (err) {
      toast.error(lang === 'zh' ? '解析失败' : 'Parse failed');
      setParsedRows([]);
      setErrorCount(0);
    }
  };

  const handleClear = () => {
    setParsedRows([]);
    setFileName('');
    setErrorCount(0);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  const openImportConfirm = () => {
    if (validRows.length === 0) {
      toast.error(lang === 'zh' ? '没有可导入的数据' : 'No valid data to import');
      return;
    }
    setConfirmOpen(true);
  };

  const doImport = async () => {
    setIsImporting(true);
    setConfirmOpen(false);

    const total = validRows.length;
    let success = 0;
    let failed = 0;

    if (mode === 'overwrite') {
      // 覆盖模式：先清空再导入
      try {
        // 用 replaceAllProducts 全部替换
          const newProducts = validRows.map((row, idx) => {
            const now = Date.now() - idx * 1000;
            const id = `csv-${Date.now()}-${idx + 1}`;
            return {
              id,
              source: 'csv' as const,
              createdAt: now,
              name: row.name || { zh: '', en: '' },
              category: row.category || '',
              priceMin: row.priceMin ?? 0,
              priceMax: row.priceMax ?? row.priceMin ?? 0,
              moq: row.moq ?? 1,
              mainImage: row.mainImage || '',
              images: row.images || [],
              description: row.description || { zh: '', en: '' },
            specs: row.specs || [],
            skus: row.skus,
              detailSections: row.detailSections,
              featured: !!row.featured,
            } as unknown as IProduct;
          });
        replaceAllProducts(newProducts);
        success = newProducts.length;
        setProgress(100);
      } catch {
        failed = total;
      }
    } else {
      // 追加模式
      for (let i = 0; i < total; i++) {
        const row = validRows[i];
        try {
          addProduct({
            name: row.name || { zh: '', en: '' },
            category: row.category || '',
            priceMin: row.priceMin ?? 0,
            priceMax: row.priceMax ?? row.priceMin ?? 0,
            moq: row.moq ?? 1,
            mainImage: row.mainImage || '',
            images: row.images || [],
            description: row.description || { zh: '', en: '' },
            specs: row.specs || [],
            skus: row.skus,
            detailSections: row.detailSections,
            featured: !!row.featured,
          });
          success++;
        } catch {
          failed++;
        }
        setProgress(Math.round(((i + 1) / total) * 100));
        // 让出主线程
        if (i % 20 === 0) await new Promise(r => setTimeout(r, 0));
      }
    }

    setIsImporting(false);

    const msg = lang === 'zh'
      ? `导入完成：成功 ${success} 条，失败 ${failed} 条`
      : `Import done: ${success} success, ${failed} failed`;
    if (failed > 0) {
      toast.warning(msg);
    } else {
      toast.success(msg);
    }

    // 重置
    handleClear();
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSpreadsheet className="size-5 text-primary" />
          {lang === 'zh' ? 'CSV 批量导入' : 'CSV Bulk Import'}
        </CardTitle>
        <CardDescription className="text-xs">
          {lang === 'zh'
            ? '支持批量导入产品数据，先下载模板填写后上传'
            : 'Bulk import products. Download the template, fill in and upload.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 模板下载 + 上传 */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-1.5"
          >
            <Download className="size-4" />
            {lang === 'zh' ? '下载CSV模板' : 'Download Template'}
          </Button>

          <div className="flex-1 w-full">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <Label
              htmlFor="csv-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed border-border/60 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
            >
              <Upload className="size-5" />
              <span>
                {fileName
                  ? (lang === 'zh' ? '已选择：' : 'Selected: ') + fileName
                  : (lang === 'zh' ? '点击选择 CSV 文件，或拖拽到此处' : 'Click to select CSV file')}
              </span>
            </Label>
          </div>

          {parsedRows.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1.5">
              <Trash2 className="size-4" />
              {lang === 'zh' ? '清除' : 'Clear'}
            </Button>
          )}
        </div>

        {/* 导入模式 */}
        {parsedRows.length > 0 && (
          <>
            <div className="bg-muted/40 rounded-lg p-4">
              <div className="text-sm font-medium text-foreground mb-3">
                {lang === 'zh' ? '导入模式' : 'Import Mode'}
              </div>
              <RadioGroup value={mode} onValueChange={v => setMode(v as ImportMode)} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="append" id="mode-append" />
                  <Label htmlFor="mode-append" className="text-sm cursor-pointer">
                    {lang === 'zh' ? '追加（在现有基础上新增）' : 'Append (add to existing)'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overwrite" id="mode-overwrite" />
                  <Label htmlFor="mode-overwrite" className="text-sm cursor-pointer text-destructive">
                    {lang === 'zh' ? '覆盖（清空现有再导入）' : 'Overwrite (replace all)'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 进度 + 统计 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {lang === 'zh' ? '解析进度' : 'Parse Progress'}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="gap-1">
                {lang === 'zh' ? '总计' : 'Total'}: {parsedRows.length}
              </Badge>
              <Badge className="bg-emerald-600 gap-1">
                <Check className="size-3" />
                {lang === 'zh' ? '有效' : 'Valid'}: {validRows.length}
              </Badge>
              {errorCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="size-3" />
                  {lang === 'zh' ? '错误' : 'Errors'}: {errorCount}
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                {lang === 'zh' ? '当前总数' : 'Current total'}: {products.length}
              </Badge>
            </div>

            {/* 预览表格 */}
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-muted/50 border-b border-border/50 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {lang === 'zh' ? '数据预览' : 'Preview'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lang === 'zh' ? '显示前 10 条' : 'Showing first 10 rows'}
                </span>
              </div>
              <div className="w-full overflow-x-auto max-h-72">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap w-12">#</TableHead>
                      <TableHead className="whitespace-nowrap">
                        {lang === 'zh' ? '产品名称' : 'Name'}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        {lang === 'zh' ? '分类' : 'Category'}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        {lang === 'zh' ? '价格' : 'Price'}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        {lang === 'zh' ? 'MOQ' : 'MOQ'}
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        {lang === 'zh' ? '状态' : 'Status'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.slice(0, 10).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs text-muted-foreground">
                          {row._rowIndex}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <span className="block truncate">
                            {row.name?.[lang as 'zh' | 'en'] || row.name?.en || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">{row.category}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          ¥{row.priceMin}
                          {row.priceMax !== row.priceMin ? ` - ¥${row.priceMax}` : ''}
                        </TableCell>
                        <TableCell>{row.moq}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row._error ? (
                            <Badge variant="destructive" className="text-xs">
                              {row._error}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-600 text-xs">
                              <Check className="size-3 mr-1" />
                              OK
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </CardContent>
      {parsedRows.length > 0 && (
        <CardFooter className="flex justify-end gap-2 border-t border-border/40">
          <Button variant="outline" size="sm" onClick={handleClear}>
            {lang === 'zh' ? '取消' : 'Cancel'}
          </Button>
          <Button
            size="sm"
            onClick={openImportConfirm}
            disabled={validRows.length === 0 || isImporting}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            {lang === 'zh' ? '确认导入' : 'Confirm Import'}
          </Button>
        </CardFooter>
      )}

      {/* 确认弹窗 */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'zh' ? '确认导入？' : 'Confirm Import?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {mode === 'overwrite'
                ? (lang === 'zh'
                    ? `覆盖模式将清空所有现有产品，导入 ${validRows.length} 条新数据。此操作不可撤销。`
                    : `Overwrite mode will delete all ${products.length} existing products and import ${validRows.length} new ones. This cannot be undone.`)
                : (lang === 'zh'
                    ? `将追加导入 ${validRows.length} 条产品数据。`
                    : `Will append ${validRows.length} products to your current list.`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'zh' ? '取消' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={doImport}
              className={mode === 'overwrite' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {lang === 'zh' ? '确认导入' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
