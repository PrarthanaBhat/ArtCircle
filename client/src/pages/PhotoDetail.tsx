import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShareButtons from '@/components/ShareButtons';
import { Heart, Download, ChevronLeft, Camera, Calendar, Eye, Map, ArrowUpRight, Tag, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';

export default function PhotoDetail() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [matched, params] = useRoute('/photo/:slug');
  const [isLiked, setIsLiked] = useState(false);
  
  // Fetch photo data
  const { data: photo, isLoading, error } = useQuery({
    queryKey: [`/api/photos/${params?.slug}`],
    enabled: !!params?.slug,
  });

  // Check if user has a subscription
  const { data: subscription } = useQuery({
    queryKey: ['/api/user/subscription'],
    retry: false
  });

  // Parse metadata if available
  const photoMetadata = photo?.metadata ? JSON.parse(photo.metadata) : null;
  
  const handleLike = async () => {
    try {
      if (isLiked) {
        await fetch(`/api/photos/${photo.id}/unlike`, {
          method: 'POST',
          credentials: 'include'
        });
      } else {
        await fetch(`/api/photos/${photo.id}/like`, {
          method: 'POST',
          credentials: 'include'
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking/unliking photo:', error);
      toast({
        title: 'Error',
        description: 'You need to be logged in to like photos',
        variant: 'destructive',
      });
    }
  };
  
  const handleDownload = () => {
    if (photo?.isPremium && !subscription) {
      toast({
        title: 'Premium Content',
        description: 'You need a subscription to download this photo',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = photo.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Download started',
      description: 'Your download has started',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !photo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Photo not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The photo you're looking for doesn't exist or has been removed.</p>
        <Link href="/gallery">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 md:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/gallery">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('backToGallery')}
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400"
              onClick={handleLike}
            >
              <Heart
                className={`mr-1 h-5 w-5 ${
                  isLiked ? 'text-accent-500 fill-accent-500' : ''
                }`}
              />
              <span>{photo.likes}</span>
            </Button>
            
            <ShareButtons photoId={photo.id} photoTitle={photo.title} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Column */}
          <div className="lg:col-span-2">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-auto object-cover"
              />
              
              {photo.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-white">
                    {t('premium')}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Details Column */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{photo.title}</h1>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                  <span>{t('by')} </span>
                  <Link href={`/photographer/${photo.user.username}`}>
                    <a className="ml-1 text-primary hover:underline">{photo.user.name}</a>
                  </Link>
                </div>
                
                {photo.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{photo.description}</p>
                )}
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Taken on {formatDate(photo.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Eye className="h-5 w-5 mr-2" />
                    <span>{photo.views} views</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Tag className="h-5 w-5 mr-2" />
                    <div className="flex flex-wrap gap-2">
                      {photo.tags?.split(',').map((tag: string, index: number) => (
                        <Link key={index} href={`/gallery?search=${tag.trim()}`}>
                          <Badge variant="outline" className="cursor-pointer">
                            {tag.trim()}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Map className="h-5 w-5 mr-2" />
                    <Link href={`/categories/${photo.category.slug}`}>
                      <a className="text-primary hover:underline">
                        {photo.category.name}
                      </a>
                    </Link>
                  </div>
                </div>
                
                <div className="flex mt-6 space-x-3">
                  <Button
                    className="flex-1"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('download')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className="flex items-center"
                  >
                    <Heart
                      className={`mr-2 h-5 w-5 ${
                        isLiked ? 'text-accent-500 fill-accent-500' : ''
                      }`}
                    />
                    {isLiked ? t('liked') : t('like')}
                  </Button>
                </div>
                
                {photo.isPremium && !subscription && (
                  <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-md">
                    <p className="text-sm text-primary-800 dark:text-primary-200">
                      {t('premiumPhotoMessage')}
                    </p>
                    <Link href="/subscriptions">
                      <Button variant="link" className="mt-1 p-0">
                        {t('subscribeToPremium')}
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Metadata Section */}
            {photoMetadata && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <Camera className="inline-block mr-2 h-5 w-5" />
                    {t('photoDetails')}
                  </h2>
                  
                  <Tabs defaultValue="exif">
                    <TabsList className="mb-4">
                      <TabsTrigger value="exif">{t('exifData')}</TabsTrigger>
                      <TabsTrigger value="metadata">{t('metadata')}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="exif" className="space-y-2">
                      {photoMetadata.format && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{t('format')}</span>
                          <span className="text-sm font-medium">{photoMetadata.format}</span>
                        </div>
                      )}
                      {photoMetadata.width && photoMetadata.height && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{t('dimensions')}</span>
                          <span className="text-sm font-medium">{photoMetadata.width} x {photoMetadata.height}</span>
                        </div>
                      )}
                      {photoMetadata.space && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{t('colorSpace')}</span>
                          <span className="text-sm font-medium">{photoMetadata.space}</span>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="metadata" className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('uploadedOn')}</span>
                        <span className="text-sm font-medium">{formatDate(photo.createdAt)}</span>
                      </div>
                      {photoMetadata.size && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{t('fileSize')}</span>
                          <span className="text-sm font-medium">{Math.round(photoMetadata.size / 1024)} KB</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('license')}</span>
                        <span className="text-sm font-medium">{photo.isPremium ? t('premium') : t('standard')}</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
