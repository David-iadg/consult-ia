import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Get the display text for the current language
  const getCurrentLanguageDisplay = () => {
    switch (i18n.language) {
      case 'fr': return 'FR';
      case 'es': return 'ES';
      default: return 'EN';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
          <span className="mr-1">{getCurrentLanguageDisplay()}</span>
          <i className="fas fa-chevron-down text-xs ml-1"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("fr")} className={i18n.language === 'fr' ? 'bg-gray-100' : ''}>
          <span className="mr-2">🇫🇷</span> Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("en")} className={i18n.language === 'en' ? 'bg-gray-100' : ''}>
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("es")} className={i18n.language === 'es' ? 'bg-gray-100' : ''}>
          <span className="mr-2">🇪🇸</span> Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
