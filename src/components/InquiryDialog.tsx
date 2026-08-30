import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLang } from '@/context/LanguageContext';

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillProduct?: string;
}

export default function InquiryDialog({ open, onOpenChange, prefillProduct = '' }: InquiryDialogProps) {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    productName: prefillProduct,
    quantity: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error(t.contact.form.required);
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success(t.contact.form.success);
    setSubmitting(false);
    setForm({ name: '', email: '', country: '', productName: prefillProduct, quantity: '', message: '' });
    onOpenChange(false);
  };

  // 当 prefillProduct 变化时更新表单
  if (prefillProduct !== form.productName && !submitting) {
    setForm(f => ({ ...f, productName: prefillProduct }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.contact.title}</DialogTitle>
          <DialogDescription>{t.contact.subtitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inq-name">{t.contact.form.name} *</Label>
              <Input
                id="inq-name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={t.contact.form.namePlaceholder}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inq-email">{t.contact.form.email} *</Label>
              <Input
                id="inq-email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder={t.contact.form.emailPlaceholder}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inq-country">{t.contact.form.country}</Label>
              <Input
                id="inq-country"
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                placeholder={t.contact.form.countryPlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inq-qty">{t.contact.form.quantity}</Label>
              <Input
                id="inq-qty"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                placeholder={t.contact.form.quantityPlaceholder}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inq-product">{t.contact.form.productName}</Label>
            <Input
              id="inq-product"
              value={form.productName}
              onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
              placeholder={t.contact.form.productPlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inq-msg">{t.contact.form.message}</Label>
            <Textarea
              id="inq-msg"
              rows={4}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder={t.contact.form.messagePlaceholder}
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t.contact.form.submitting : t.contact.form.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
