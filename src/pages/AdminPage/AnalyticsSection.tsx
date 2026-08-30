import { useState, useMemo } from 'react';
import { BarChart3, Users, Eye, Globe, Download, Trash2, Info, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useLang } from '@/context/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsSection() {
  const { lang } = useLang();
  const { data, loaded, exportCSV, clearData, getLast30Days, getTopProducts } = useAnalytics();
  const [clearOpen, setClearOpen] = useState(false);

  const last30Days = useMemo(() => getLast30Days(), [data.dailyVisits, loaded]);
  const topProducts = useMemo(() => getTopProducts(10), [data.productViews, loaded]);

  const totalPV = last30Days.reduce((sum, d) => sum + d.pv, 0);
  const totalUV = last30Days.reduce((sum, d) => sum + d.uv, 0);
  const totalVisits = data.countryVisits.reduce((sum, c) => sum + c.count, 0);
  const maxPV = Math.max(...last30Days.map(d => d.pv), 1);

  const handleClear = () => {
    clearData();
    toast.success(lang === 'zh' ? '数据已清空' : 'Data cleared');
    setClearOpen(false);
  };

  const handleExport = () => {
    exportCSV();
    toast.success(lang === 'zh' ? 'CSV已导出' : 'CSV exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {lang === 'zh' ? '运营数据分析' : 'Analytics Dashboard'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'zh' ? '前端埋点统计，数据存储在本地浏览器' : 'Frontend tracking, data stored in local browser'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="size-4" />
            {lang === 'zh' ? '导出CSV' : 'Export CSV'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearOpen(true)}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4" />
            {lang === 'zh' ? '清空数据' : 'Clear Data'}
          </Button>
        </div>
      </div>

      {/* 提示 */}
      <Alert className="bg-blue-50/50 border-blue-200">
        <Info className="size-4 text-blue-600" />
        <AlertDescription className="text-blue-700 text-sm">
          {lang === 'zh'
            ? '💡 提示：当前为纯前端埋点统计，数据仅供参考。建议部署后集成 Google Analytics 获取更全面准确的统计数据。'
            : '💡 Note: This is frontend-only tracking for reference. We recommend integrating Google Analytics after deployment for comprehensive accurate data.'}
        </AlertDescription>
      </Alert>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Eye className="size-4" />
              <span className="text-xs">{lang === 'zh' ? '近30天PV' : '30d PV'}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalPV.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="size-4" />
              <span className="text-xs">{lang === 'zh' ? '近30天UV' : '30d UV'}</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{totalUV.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart3 className="size-4" />
              <span className="text-xs">{lang === 'zh' ? '产品浏览' : 'Product Views'}</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {data.productViews.reduce((s, p) => s + p.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Globe className="size-4" />
              <span className="text-xs">{lang === 'zh' ? '访客国家' : 'Countries'}</span>
            </div>
            <div className="text-2xl font-bold text-amber-600">{data.countryVisits.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visits">
        <TabsList>
          <TabsTrigger value="visits" className="gap-1.5">
            <TrendingUp className="size-3.5" />
            {lang === 'zh' ? '访问趋势' : 'Visit Trend'}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <Eye className="size-3.5" />
            {lang === 'zh' ? '产品排行' : 'Top Products'}
          </TabsTrigger>
          <TabsTrigger value="countries" className="gap-1.5">
            <Globe className="size-3.5" />
            {lang === 'zh' ? '国家分布' : 'Countries'}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="visits">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">{lang === 'zh' ? '最近30天访问趋势' : 'Last 30 Days Visit Trend'}</CardTitle>
                <CardDescription>
                  {lang === 'zh' ? '每日页面浏览量(PV)和独立访客(UV)' : 'Daily Page Views (PV) and Unique Visitors (UV)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 纯CSS柱状图 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-primary" />
                      <span className="text-muted-foreground">PV</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                      <span className="text-muted-foreground">UV</span>
                    </div>
                  </div>
                  <div className="w-full h-52 flex items-end gap-0.5 border-b border-l border-border/40 pl-2 pb-2 relative">
                    {last30Days.map((d, i) => {
                      const pvHeight = maxPV > 0 ? (d.pv / maxPV) * 100 : 0;
                      const uvHeight = maxPV > 0 ? (d.uv / maxPV) * 100 : 0;
                      const showLabel = i % 5 === 0 || i === last30Days.length - 1;
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                          {/* Tooltip */}
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                            <div>{d.date}</div>
                            <div>PV: {d.pv} · UV: {d.uv}</div>
                          </div>
                          <div className="flex items-end gap-px w-full justify-center h-44">
                            <div
                              className="w-1.5 bg-primary/80 rounded-t transition-all hover:bg-primary"
                              style={{ height: `${pvHeight}%`, minHeight: d.pv > 0 ? '2px' : '0' }}
                            />
                            <div
                              className="w-1.5 bg-emerald-500/80 rounded-t transition-all hover:bg-emerald-500"
                              style={{ height: `${uvHeight}%`, minHeight: d.uv > 0 ? '2px' : '0' }}
                            />
                          </div>
                          {showLabel && (
                            <span className="text-[10px] text-muted-foreground -rotate-45 origin-left translate-x-1">
                              {d.date.slice(5)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">{lang === 'zh' ? '产品浏览排行榜 Top 10' : 'Top 10 Most Viewed Products'}</CardTitle>
                <CardDescription>
                  {lang === 'zh' ? '按浏览次数排序' : 'Ranked by view count'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {topProducts.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    {lang === 'zh' ? '暂无产品浏览数据' : 'No product view data yet'}
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap w-16">#</TableHead>
                          <TableHead className="whitespace-nowrap">{lang === 'zh' ? '产品名称' : 'Product Name'}</TableHead>
                          <TableHead className="whitespace-nowrap text-right">{lang === 'zh' ? '浏览次数' : 'Views'}</TableHead>
                          <TableHead className="whitespace-nowrap w-1/3">{lang === 'zh' ? '占比' : 'Share'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const maxViews = Math.max(...topProducts.map(p => p.views), 1);
                          return topProducts.map((p, i) => (
                            <TableRow key={p.productId}>
                              <TableCell>
                                <Badge variant={i < 3 ? 'default' : 'secondary'} className="w-6 h-6 justify-center p-0 text-xs">
                                  {i + 1}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                <span className="block truncate max-w-[300px]">{p.productName}</span>
                              </TableCell>
                              <TableCell className="text-right tabular-nums">{p.views}</TableCell>
                              <TableCell>
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-primary/80 rounded-full transition-all"
                                    style={{ width: `${(p.views / maxViews) * 100}%` }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ));
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">{lang === 'zh' ? '访客国家分布' : 'Visitor Country Distribution'}</CardTitle>
                <CardDescription>
                  {lang === 'zh' ? '基于IP地理定位' : 'Based on IP geolocation (ipapi.co)'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {data.countryVisits.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    {lang === 'zh' ? '暂无国家数据' : 'No country data yet'}
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap w-16">#</TableHead>
                          <TableHead className="whitespace-nowrap">{lang === 'zh' ? '国家/地区' : 'Country/Region'}</TableHead>
                          <TableHead className="whitespace-nowrap text-right">{lang === 'zh' ? '访问次数' : 'Visits'}</TableHead>
                          <TableHead className="whitespace-nowrap text-right w-24">{lang === 'zh' ? '占比' : 'Share'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.countryVisits.map((c, i) => (
                          <TableRow key={c.country}>
                            <TableCell>
                              <Badge variant="secondary" className="w-6 h-6 justify-center p-0 text-xs">
                                {i + 1}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{c.country}</TableCell>
                            <TableCell className="text-right tabular-nums">{c.count}</TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {totalVisits > 0 ? ((c.count / totalVisits) * 100).toFixed(1) + '%' : '0%'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* 清空确认 */}
      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'zh' ? '确认清空所有统计数据？' : 'Clear all analytics data?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'zh'
                ? '此操作将删除所有访问记录、产品浏览记录和国家分布数据，无法恢复。'
                : 'This will delete all visit records, product views, and country data. Cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'zh' ? '取消' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground">
              {lang === 'zh' ? '清空' : 'Clear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
