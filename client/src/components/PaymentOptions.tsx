import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';

interface PaymentOptionProps {
  icon: React.ReactNode;
  name: string;
}

function PaymentOption({ icon, name }: PaymentOptionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      {icon}
      <span className="sr-only">{name}</span>
    </div>
  );
}

export default function PaymentOptions() {
  const { t } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

  const currencies: Record<Currency, string> = {
    USD: 'USD ($)',
    EUR: 'EUR (€)',
    GBP: 'GBP (£)',
    JPY: 'JPY (¥)',
    AUD: 'AUD ($)',
    CAD: 'CAD ($)'
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading sm:text-4xl">
            {t('flexiblePaymentOptions')}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            {t('paymentDescription')}
          </p>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          <PaymentOption icon={<FaCcVisa className="text-blue-600 text-4xl" />} name="Visa" />
          <PaymentOption icon={<FaCcMastercard className="text-red-500 text-4xl" />} name="Mastercard" />
          <PaymentOption icon={<FaCcAmex className="text-blue-400 text-4xl" />} name="American Express" />
          <PaymentOption icon={<FaCcPaypal className="text-blue-700 text-4xl" />} name="PayPal" />
          <PaymentOption icon={<FaApplePay className="text-black dark:text-white text-4xl" />} name="Apple Pay" />
          <PaymentOption icon={<FaGooglePay className="text-gray-700 dark:text-gray-300 text-4xl" />} name="Google Pay" />
        </div>
        
        <div className="mt-10 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {t('currencyPreference')}
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(currencies).map(([code, label]) => (
                <Button
                  key={code}
                  variant={selectedCurrency === code ? "secondary" : "outline"}
                  className={selectedCurrency === code 
                    ? "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                  onClick={() => setSelectedCurrency(code as Currency)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('priceCurrency')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
