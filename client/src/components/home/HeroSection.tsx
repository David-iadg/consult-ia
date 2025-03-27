import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold font-inter mb-4 leading-tight">
            {t('hero.title')} <span className="text-accent">{t('hero.titleAccent')}</span>
          </h1>
          <p className="text-xl mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
              <Button className="bg-accent hover:bg-opacity-90 text-white font-medium py-6 px-6 rounded-lg text-center transition-all transform hover:scale-105 w-full sm:w-auto">
                {t('hero.cta.quote')}
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-6 px-6 rounded-lg text-center transition-all w-full sm:w-auto">
                {t('hero.cta.discover')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
