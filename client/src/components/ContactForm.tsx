import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Reset the form
      form.reset();
      
      // Show success message
      toast({
        title: 'Message sent!',
        description: 'Thank you for reaching out. We will get back to you soon.',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        title: 'Failed to send message',
        description: 'There was a problem sending your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('name')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('namePlaceholder')}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('email')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('emailContactPlaceholder')}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('subject')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('subjectPlaceholder')}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('message')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={t('messagePlaceholder')}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="sm:col-span-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('sendMessage')}
                </div>
              ) : (
                t('sendMessage')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
