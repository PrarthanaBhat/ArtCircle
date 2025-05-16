import { useTranslation } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import PhotoCard from '@/components/PhotoCard';
import CategoryCard from '@/components/CategoryCard';
import SubscriptionPlan from '@/components/SubscriptionPlan';
import PaymentOptions from '@/components/PaymentOptions';

export default function Home() {
  const { t } = useTranslation();
  
  // Fetch featured photos
  const { data: photosQueryData, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['/api/photos?limit=6'],
  });
  // Ensure photos data is properly structured
  const photosData = photosQueryData || { photos: [] };
  
  // Fetch categories
  const { data: categoriesQueryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });
  // Ensure categories data is properly structured
  const categoriesData = categoriesQueryData || [];
  
  // Fetch subscription plans
  const { data: plansQueryData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['/api/subscription-plans'],
  });
  // Ensure plans data is properly structured
  const plansData = plansQueryData || [];
  
  return (
    <>
      <Hero />
      
      {/* Featured Photography */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading sm:text-4xl">
              {t('featuredPhotography')}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              {t('featuredDescription')}
            </p>
          </div>
          
          <div className="mt-12">
            {isLoadingPhotos ? (
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <MasonryGrid>
                {photosData && photosData.photos && Array.isArray(photosData.photos) ? 
                  photosData.photos.map((photo: any) => (
                    <PhotoCard
                      key={photo.id}
                      id={photo.id}
                      title={photo.title}
                      photographer={photo.user?.name || 'Unknown Photographer'}
                      imageUrl={photo.imageUrl}
                      likes={photo.likes || 0}
                      isPremium={photo.isPremium || false}
                      slug={photo.slug}
                    />
                  )) : null
                }
              </MasonryGrid>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/gallery">
              <Button>
                {t('viewAllPhotos')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading sm:text-4xl">
              {t('browseByCategory')}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              {t('categoryDescription')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingCategories ? (
              <div className="col-span-full flex justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              categoriesData && Array.isArray(categoriesData) ? categoriesData.slice(0, 4).map((category: any) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  slug={category.slug}
                  photoCount={category.photo_count || 0}
                  imageUrl={category.cover_image}
                />
              )) : null
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/categories" className="text-primary dark:text-primary-400 hover:text-primary-500 font-medium inline-flex items-center">
              {t('viewAllCategories')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Subscription Plans */}
      <section id="subscriptions" className="bg-white dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading sm:text-4xl">
              {t('subscriptionPlans')}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              {t('subscriptionDescription')}
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {isLoadingPlans ? (
              <div className="col-span-full flex justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              plansData && Array.isArray(plansData) ? plansData.map((plan: any, index: number) => {
                const features = JSON.parse(plan.features || '[]');
                return (
                  <SubscriptionPlan
                    key={plan.id}
                    title={plan.name}
                    price={plan.monthlyPrice / 100}
                    yearlyPrice={plan.yearlyPrice / 100}
                    features={features}
                    isPopular={plan.type === 'pro'}
                  />
                );
              }) : null
            )}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              {t('flexiblePayment')}<br />
              {t('needCustom')}&nbsp;
              <Link href="/contact" className="text-primary dark:text-primary-400 hover:text-primary-500 font-medium">
                {t('contactUs')}
              </Link>.
            </p>
          </div>
        </div>
      </section>
      
      {/* Payment Options */}
      <PaymentOptions />
    </>
  );
}
