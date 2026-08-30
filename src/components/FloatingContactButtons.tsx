import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialIcon from '@/components/SocialIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Image } from '@/components/ui/image';
import { useContactSettings } from '@/hooks/useContactSettings';

const WHATSAPP_TEXT = "Hi, I'm interested in wholesale EV charging accessories. Please send me the catalog and price list.";

export default function FloatingContactButtons() {
  const [wechatOpen, setWechatOpen] = useState(false);
  const { settings, getWaUrl, loaded } = useContactSettings();

  const waUrl = getWaUrl(WHATSAPP_TEXT);

  if (!loaded) return null;

  return (
    <TooltipProvider>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
              aria-label="Chat on WhatsApp"
            >
              <SocialIcon platform="whatsapp" className="size-7" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            <p className="text-sm font-medium">Chat with us</p>
          </TooltipContent>
        </Tooltip>

        {/* WeChat Button */}
        <button
          onClick={() => setWechatOpen(true)}
          className="flex items-center justify-center size-14 rounded-full bg-[#07C160] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          aria-label="Add WeChat"
        >
          <SocialIcon platform="wechat" className="size-7" />
        </button>
      </div>

      {/* WeChat QR Dialog */}
      <Dialog open={wechatOpen} onOpenChange={setWechatOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              扫码添加微信
            </DialogTitle>
            <DialogDescription className="text-center">
              Scan to add WeChat
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-[280px] h-[280px] rounded-xl overflow-hidden border-2 border-border bg-card flex items-center justify-center">
              <Image
                src={settings.wechatQrUrl}
                alt="WeChat QR Code"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">
                WeChat: {settings.wechatId}
              </p>
              <p className="text-xs text-muted-foreground">
                Add us for wholesale pricing and catalog
              </p>
            </div>
          </div>
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="mt-2">
              <X className="size-4 mr-2" />
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
