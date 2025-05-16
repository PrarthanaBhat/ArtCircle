import { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@/lib/i18n';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import ShareButtons from './ShareButtons';

interface PhotoCardProps {
  id: number;
  title: string;
  photographer: string;
  imageUrl: string;
  likes: number;
  isPremium: boolean;
  slug: string;
}

export default function PhotoCard({ id, title, photographer, imageUrl, likes, isPremium, slug }: PhotoCardProps) {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card 
      className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-700 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/photo/${slug}`} className="block relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-auto object-cover aspect-[3/2]"
        />
        
        {isHovered && (
          <div className="absolute top-2 right-2">
            <ShareButtons photoId={id} photoTitle={title} />
          </div>
        )}
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/photo/${slug}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{t('by')} {photographer}</p>
        </Link>
        
        <div className="mt-2 flex justify-between items-center">
          <button
            className="flex items-center space-x-1 group"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${
                liked ? 'text-accent-500 fill-accent-500' : 'text-gray-400 group-hover:text-accent-500'
              }`}
            />
            <span className="text-sm text-gray-500 dark:text-gray-300">{likesCount}</span>
          </button>
          
          {isPremium ? (
            <Badge variant="secondary" className="bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
              {t('premium')}
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              {t('free')}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
