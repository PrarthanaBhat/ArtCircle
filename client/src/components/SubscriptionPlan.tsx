import { useTranslation } from '@/lib/i18n';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionPlanProps {
  title: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
}

export default function SubscriptionPlan({ 
  title, 
  price, 
  yearlyPrice, 
  features, 
  isPopular = false 
}: SubscriptionPlanProps) {
  const { t } = useTranslation();

  return (
    <div className={`subscription-option border ${
      isPopular 
        ? 'border-2 border-primary' 
        : 'border-gray-200 dark:border-gray-700'
      } rounded-lg shadow-sm p-6 bg-white dark:bg-gray-700 flex flex-col transition duration-300 relative`}
    >
      {isPopular && (
        <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-white text-xs font-bold py-1 px-3 rounded-full">
          {t('popular')}
        </span>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      
      <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
        <span className="text-4xl font-extrabold tracking-tight">${price.toFixed(2)}</span>
        <span className="ml-1 text-xl font-semibold">{t('month')}</span>
      </div>
      
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {t('or')} ${yearlyPrice.toFixed(2)}{t('year')} ({t('savePercent')})
      </p>
      
      <ul role="list" className="mt-6 space-y-4 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature}</p>
          </li>
        ))}
      </ul>
      
      <Button className="mt-8 w-full">
        {t('subscribeNow')}
      </Button>
    </div>
  );
}
