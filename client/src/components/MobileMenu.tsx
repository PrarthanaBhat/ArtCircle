import { Link } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeProvider";
import { X, Image, FolderOpen } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 divide-y-2 divide-gray-50 dark:divide-gray-700">
        <div className="pt-5 pb-6 px-5">
          <div className="flex items-center justify-between">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary dark:text-primary-400 h-8 w-8">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <div className="-mr-2">
              <button
                type="button"
                className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={onClose}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-6">
            <nav className="grid gap-y-8">
              <Link href="/gallery" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClose}>
                <Image className="flex-shrink-0 h-6 w-6 text-primary dark:text-primary-400" />
                <span className="ml-3 text-base font-medium text-gray-900 dark:text-gray-100">{t('gallery')}</span>
              </Link>
              <Link href="/categories" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClose}>
                <FolderOpen className="flex-shrink-0 h-6 w-6 text-primary dark:text-primary-400" />
                <span className="ml-3 text-base font-medium text-gray-900 dark:text-gray-100">{t('categories')}</span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="py-6 px-5 space-y-6">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <Link href="/about" className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300" onClick={onClose}>
              {t('about')}
            </Link>
            <Link href="/contact" className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300" onClick={onClose}>
              {t('contact')}
            </Link>
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-900 dark:text-gray-100 mr-2">{t('theme')}:</span>
              <button 
                className="text-base font-medium text-primary dark:text-primary-400"
                onClick={() => {
                  toggleTheme();
                }}
              >
                <span className="dark:hidden">{t('darkMode')}</span>
                <span className="hidden dark:inline">{t('lightMode')}</span>
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-900 dark:text-gray-100 mr-2">{t('language')}:</span>
              <button className="text-base font-medium text-primary dark:text-primary-400">
                EN <svg className="inline-block ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
