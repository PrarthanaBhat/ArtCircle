import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  photoId: number;
  photoTitle: string;
}

export default function ShareButtons({ photoId, photoTitle }: ShareButtonsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const getPhotoUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/photo/${photoId}`;
  };

  const handleShareFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = encodeURIComponent(getPhotoUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
    setOpen(false);
  };

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = encodeURIComponent(getPhotoUrl());
    const text = encodeURIComponent(`Check out this photo: ${photoTitle}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
    setOpen(false);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(getPhotoUrl()).then(() => {
      toast({
        title: 'Link Copied',
        description: 'Photo link copied to clipboard',
      });
      setOpen(false);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
        <Button variant="secondary" size="icon" className="rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
        <div className="grid gap-1">
          <Button variant="ghost" className="flex items-center justify-start" onClick={handleShareFacebook}>
            <Facebook className="mr-2 h-4 w-4 text-blue-600" />
            <span>Facebook</span>
          </Button>
          <Button variant="ghost" className="flex items-center justify-start" onClick={handleShareTwitter}>
            <Twitter className="mr-2 h-4 w-4 text-blue-400" />
            <span>Twitter</span>
          </Button>
          <Button variant="ghost" className="flex items-center justify-start" onClick={handleCopyLink}>
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>Copy Link</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
