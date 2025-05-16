import { useState } from "react";
import { useTranslation, Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languageNames: Record<Language, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ja: "日本語"
};

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="inline-flex items-center">
          <Globe className="mr-2 h-4 w-4" />
          <span>{language.toUpperCase()}</span>
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => handleSelectLanguage(code as Language)}
            className={language === code ? "bg-primary/10" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
