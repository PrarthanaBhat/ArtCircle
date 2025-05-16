import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import PhotoCard from '@/components/PhotoCard';
import PhotoUpload from '@/components/PhotoUpload';
import { User, CreditCard, Image, Settings, LogOut } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Fetch current user
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/auth/user'],
  });
  
  // Fetch user photos
  const { data: photosData, isLoading: isLoadingPhotos } = useQuery({
    queryKey: [`/api/user/photos`],
    enabled: !!userData?.user?.id,
  });
  
  // Fetch user subscription
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['/api/user/subscription'],
    enabled: !!userData?.user?.id,
  });
  
  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', undefined);
      
      // Invalidate user query to update UI
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!userData?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Please log in to access your dashboard.</p>
        <div className="flex space-x-4">
          <Link href="/login">
            <Button>{t('signIn')}</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">{t('signUp')}</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const { user } = userData;
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-heading">
              {t('dashboard')}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {t('welcomeBack')}, {user.name || user.username}!
            </p>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  orientation="vertical"
                  className="w-full"
                >
                  <TabsList className="w-full justify-start border-r border-gray-200 dark:border-gray-700 flex flex-col items-stretch h-full">
                    <TabsTrigger
                      value="profile"
                      className="w-full justify-start px-4 py-3"
                    >
                      <User className="mr-2 h-5 w-5" />
                      {t('profile')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="photos"
                      className="w-full justify-start px-4 py-3"
                    >
                      <Image className="mr-2 h-5 w-5" />
                      {t('myPhotos')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="upload"
                      className="w-full justify-start px-4 py-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      {t('uploadPhoto')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="subscription"
                      className="w-full justify-start px-4 py-3"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      {t('subscription')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="w-full justify-start px-4 py-3"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      {t('settings')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <TabsContent value="profile" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile')}</CardTitle>
                  <CardDescription>{t('manageYourProfile')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold text-gray-500 dark:text-gray-400">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{user.name || user.username}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t('memberSince')} {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {user.bio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('bio')}</h4>
                        <p className="text-gray-900 dark:text-gray-100">{user.bio}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline">{t('editProfile')}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="photos" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('myPhotos')}</CardTitle>
                  <CardDescription>{t('manageYourPhotos')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPhotos ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : photosData?.photos?.length > 0 ? (
                    <MasonryGrid columnCount={3}>
                      {photosData.photos.map((photo: any) => (
                        <PhotoCard
                          key={photo.id}
                          id={photo.id}
                          title={photo.title}
                          photographer={user.name || user.username}
                          imageUrl={photo.imageUrl}
                          likes={photo.likes}
                          isPremium={photo.isPremium}
                          slug={photo.slug}
                        />
                      ))}
                    </MasonryGrid>
                  ) : (
                    <div className="text-center py-12">
                      <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {t('noPhotosYet')}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {t('startByUploading')}
                      </p>
                      <Button onClick={() => setActiveTab('upload')}>
                        {t('uploadPhoto')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upload" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('uploadPhoto')}</CardTitle>
                  <CardDescription>{t('shareYourPhotography')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoUpload />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('subscription')}</CardTitle>
                  <CardDescription>{t('manageYourSubscription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSubscription ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : subscriptionData ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {t('activeSubscription')}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('plan')}</span>
                          <span className="font-medium">{subscriptionData.plan.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('status')}</span>
                          <span className="font-medium capitalize">{subscriptionData.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('billingCycle')}</span>
                          <span className="font-medium capitalize">{subscriptionData.interval}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('startDate')}</span>
                          <span className="font-medium">{formatDate(subscriptionData.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('nextBilling')}</span>
                          <span className="font-medium">{formatDate(subscriptionData.endDate)}</span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button variant="outline">{t('manageBilling')}</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {t('noActiveSubscription')}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {t('subscribeToUnlock')}
                      </p>
                      <Link href="/subscriptions">
                        <Button>{t('viewPlans')}</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings')}</CardTitle>
                  <CardDescription>{t('manageYourAccountSettings')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{t('accountSettings')}</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium">{t('changePassword')}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('updateYourPassword')}</p>
                          </div>
                          <Button variant="outline" size="sm">{t('change')}</Button>
                        </div>
                        
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                          <div>
                            <h4 className="font-medium">{t('emailNotifications')}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('manageEmailPreferences')}</p>
                          </div>
                          <Button variant="outline" size="sm">{t('manage')}</Button>
                        </div>
                        
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <h4 className="font-medium text-red-600 dark:text-red-500">{t('deleteAccount')}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('permanentlyDeleteAccount')}</p>
                          </div>
                          <Button variant="destructive" size="sm">{t('delete')}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}
