import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Hero() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-700 opacity-90"></div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-heading">
          {t('discoverPremium')}
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          {t('premiumDescription')}
        </p>
        <div className="mt-10 max-w-sm">
          <form onSubmit={handleSubmit} className="sm:flex">
            <label htmlFor="email-address" className="sr-only">
              {t('email')}
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full px-5 py-3 border border-transparent placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
              placeholder={t('emailPlaceholder')}
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <Button type="submit" variant="secondary" className="w-full flex items-center justify-center">
                {t('getStarted')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
