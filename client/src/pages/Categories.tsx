import { useTranslation } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import CategoryCard from '@/components/CategoryCard';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import PhotoCard from '@/components/PhotoCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useState } from 'react';

export default function Categories() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Check if we're on a specific category page
  const categorySlug = location.startsWith('/categories/') ? location.replace('/categories/', '') : null;
  
  // Fetch all categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch specific category and its photos if on a category page
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: [`/api/categories/${categorySlug}`],
    enabled: !!categorySlug,
  });
  
  const { data: photosData, isLoading: isLoadingPhotos } = useQuery({
    queryKey: [`/api/categories/${categorySlug}/photos?page=${currentPage}&limit=12`],
    enabled: !!categorySlug,
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const renderPagination = () => {
    if (!photosData || photosData.total <= 12) return null;
    
    const totalPages = photosData.pages;
    const pages = [];
    
    // Always show first page
    pages.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {pages}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  if (categorySlug) {
    // Category detail view
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link href="/categories">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t('backToCategories')}
                </Button>
              </Link>
            </div>
            
            {isLoadingCategory ? (
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
                  {categoryData?.name}
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {categoryData?.description}
                </p>
                {photosData?.total && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {photosData.total} {t('photos')}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {isLoadingPhotos ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : photosData?.photos?.length > 0 ? (
            <MasonryGrid columnCount={4} className="mb-8">
              {photosData.photos.map((photo: any) => (
                <PhotoCard
                  key={photo.id}
                  id={photo.id}
                  title={photo.title}
                  photographer={photo.users.name}
                  imageUrl={photo.imageUrl}
                  likes={photo.likes}
                  isPremium={photo.isPremium}
                  slug={photo.slug}
                />
              ))}
            </MasonryGrid>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('noPhotosInCategory')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('checkBackLater')}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            {renderPagination()}
          </div>
        </div>
      </div>
    );
  }
  
  // Categories list view
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
            {t('categories')}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('categoryDescription')}
          </p>
        </div>
        
        {isLoadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData?.map((category: any) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                photoCount={category.photo_count || 0}
                imageUrl={category.cover_image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
