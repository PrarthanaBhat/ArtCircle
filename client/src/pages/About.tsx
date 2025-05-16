import { useTranslation } from '@/lib/i18n';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Camera, Users, Heart, Award, Globe, ShieldCheck } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-700 opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-heading">
              {t('aboutUs')}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-white">
              {t('aboutUsSubtitle')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="bg-white dark:bg-gray-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
                {t('ourStory')}
              </h2>
              <div className="mt-6 text-lg text-gray-500 dark:text-gray-300 space-y-6">
                <p>
                  {t('ourStoryP1')}
                </p>
                <p>
                  {t('ourStoryP2')}
                </p>
                <p>
                  {t('ourStoryP3')}
                </p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1554080353-a576cf803bda" 
                    alt="Urban photography" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mt-8 sm:mt-16">
                  <img 
                    src="https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb" 
                    alt="Portrait photography" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
              {t('ourMission')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              {t('ourMissionSubtitle')}
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {t('qualityContent')}
              </h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                {t('qualityContentDesc')}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {t('supportingArtists')}
              </h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                {t('supportingArtistsDesc')}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {t('inspiringCreativity')}
              </h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                {t('inspiringCreativityDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="bg-white dark:bg-gray-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">
              {t('ourValues')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              {t('ourValuesSubtitle')}
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Award className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('excellence')}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {t('excellenceDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('integrity')}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {t('integrityDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Globe className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('diversity')}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {t('diversityDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('community')}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {t('communityDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Camera className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('innovation')}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {t('innovationDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('passion')}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {t('passionDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              {t('joinCommunity')}
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              {t('joinCommunityDesc')}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">
                  {t('signUp')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary-700">
                  {t('contactUs')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
