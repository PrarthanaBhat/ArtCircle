import { Link } from "wouter";
import { useTheme } from "@/lib/ThemeProvider";
import { useTranslation } from "@/lib/i18n";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="relative bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <span className="sr-only">ArtLens</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary dark:text-primary w-8 h-8 mr-2">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <span className="font-heading font-bold text-2xl text-gray-900 dark:text-white">ArtLens</span>
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/gallery" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
              {t('gallery')}
            </Link>
            <Link href="/categories" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
              {t('categories')}
            </Link>
            <Link href="/about" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
              {t('about')}
            </Link>
            <Link href="/contact" className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
              {t('contact')}
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            <LanguageSelector />
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">
                {theme === 'dark' ? t('lightMode') : t('darkMode')}
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
