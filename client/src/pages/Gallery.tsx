import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import PhotoCard from '@/components/PhotoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Filter } from 'lucide-react';

export default function Gallery() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch photos with filters
  const { data: photoData, isLoading, refetch } = useQuery({
    queryKey: [`/api/photos?page=${currentPage}&limit=12${category ? `&category=${category}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}&sortBy=${sortBy}`],
  });
  
  // Ensure the data is properly structured
  const data = photoData || { photos: [], total: 0, pages: 1 };
  
  // Fetch categories for filter
  const { data: categoriesQueryData } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Ensure the categories data is properly structured
  const categoriesData = categoriesQueryData || [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const renderPagination = () => {
    if (!data || data.total <= 12) return null;
    
    const totalPages = data.pages;
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
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
              {t('gallery')}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {data?.total ? `${data.total} ${t('photos')}` : ''}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button type="submit" className="ml-2">
                {t('search')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{t('filters')}:</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={category || "all_categories"} onValueChange={(value) => {
              setCategory(value === "all_categories" ? null : value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">{t('allCategories')}</SelectItem>
                {categoriesData?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('newest')}</SelectItem>
                <SelectItem value="popular">{t('mostPopular')}</SelectItem>
                <SelectItem value="views">{t('mostViewed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data?.photos?.length > 0 ? (
          <MasonryGrid columnCount={4} className="mb-8">
            {data.photos.map((photo: any) => (
              <PhotoCard
                key={photo.id}
                id={photo.id}
                title={photo.title}
                photographer={photo.user?.name || photo.users?.name || 'Unknown Photographer'}
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
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No photos found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
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
