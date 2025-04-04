import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative bg-gradient-to-r from-consultia-blue to-consultia-gray-light text-white py-20">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold font-inter mb-4 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-2xl italic font-light mb-6">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-consultia-blue-80 px-4 py-2 rounded-full text-sm font-medium">Transformation numérique</span>
            <span className="bg-consultia-blue-80 px-4 py-2 rounded-full text-sm font-medium">Communication stratégique</span>
            <span className="bg-consultia-blue-80 px-4 py-2 rounded-full text-sm font-medium">Analyse organisationnelle</span>
            <span className="bg-consultia-blue-80 px-4 py-2 rounded-full text-sm font-medium">Solutions IA</span>
            <span className="bg-consultia-blue-80 px-4 py-2 rounded-full text-sm font-medium">Stratégie digitale</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
              <Button className="bg-white text-consultia-blue hover:bg-opacity-90 font-medium py-6 px-6 rounded-lg text-center transition-all transform hover:scale-105 w-full sm:w-auto">
                {t('hero.cta.quote')}
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" className="border-white bg-transparent hover:bg-white hover:bg-opacity-10 text-white font-medium py-6 px-6 rounded-lg text-center transition-all w-full sm:w-auto">
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
