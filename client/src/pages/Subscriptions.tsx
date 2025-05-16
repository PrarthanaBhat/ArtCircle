import { useTranslation } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import SubscriptionPlan from '@/components/SubscriptionPlan';
import PaymentOptions from '@/components/PaymentOptions';
import { CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function Subscriptions() {
  const { t } = useTranslation();
  
  // Fetch subscription plans
  const { data: plansData, isLoading } = useQuery({
    queryKey: ['/api/subscription-plans'],
  });
  
  // Fetch user subscription
  const { data: userSubscription } = useQuery({
    queryKey: ['/api/user/subscription'],
    retry: false
  });
  
  const renderSubscriptionBenefits = () => (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mb-12">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t('subscriptionBenefits')}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex gap-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('premiumContent')}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('premiumContentDesc')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('highResDownloads')}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('highResDownloadsDesc')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('metadataAccess')}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('metadataAccessDesc')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('prioritySupport')}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('prioritySupportDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderActiveSubscription = () => {
    if (!userSubscription) return null;
    
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-6 mb-12">
        <div className="flex items-start gap-4">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('activeSubscription')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {t('youAreSubscribedTo')} <span className="font-semibold">{userSubscription.plan.name}</span> {t('plan')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {t('validUntil')} {new Date(userSubscription.endDate).toLocaleDateString()}
            </p>
            <div className="mt-4">
              <Link href="/dashboard">
                <a className="text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium text-sm">
                  {t('managePlan')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading sm:text-4xl">
            {t('subscriptionPlans')}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {t('subscriptionDescription')}
          </p>
        </div>
        
        {renderSubscriptionBenefits()}
        
        {renderActiveSubscription()}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {plansData?.map((plan: any) => {
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
            })}
          </div>
        )}
        
        <div className="mt-10 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            {t('flexiblePayment')}<br />
            {t('needCustom')}&nbsp;
            <Link href="/contact" className="text-primary dark:text-primary-400 hover:text-primary-500 font-medium">
              {t('contactUs')}
            </Link>.
          </p>
        </div>
        
        <div className="mt-16">
          <PaymentOptions />
        </div>
      </div>
    </div>
  );
}
