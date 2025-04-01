import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import logoWithText from "../../assets/Logo-consultia-sans-slogan.png";
// Slogan: "L'expertise humaine amplifiée par l'intelligence artificielle"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src={logoWithText} alt="ConsultIA Logo" className="h-14" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium hover:text-primary transition-colors ${location === "/" ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/#services" 
              className="font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {t('nav.services')}
            </Link>
            <Link 
              href="/laboratory" 
              className={`font-medium hover:text-primary transition-colors ${location === "/laboratory" ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.laboratory')}
            </Link>
            <Link 
              href="/blog" 
              className={`font-medium hover:text-primary transition-colors ${location.startsWith("/blog") ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.blog')}
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium hover:text-primary transition-colors ${location === "/contact" ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Language Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <i className="fas fa-times text-xl"></i>
            ) : (
              <i className="fas fa-bars text-xl"></i>
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} pb-4`}>
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className={`font-medium hover:text-primary py-2 transition-colors ${location === "/" ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/#services"
              className="font-medium hover:text-primary py-2 transition-colors"
              onClick={closeMobileMenu}
            >
              {t('nav.services')}
            </Link>
            <Link
              href="/laboratory"
              className={`font-medium hover:text-primary py-2 transition-colors ${location === "/laboratory" ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.laboratory')}
            </Link>
            <Link
              href="/blog"
              className={`font-medium hover:text-primary py-2 transition-colors ${location.startsWith("/blog") ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.blog')}
            </Link>
            <Link
              href="/contact"
              className={`font-medium hover:text-primary py-2 transition-colors ${location === "/contact" ? "text-primary" : ""}`}
              onClick={closeMobileMenu}
            >
              {t('nav.contact')}
            </Link>

            <div className="pt-2 border-t border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
