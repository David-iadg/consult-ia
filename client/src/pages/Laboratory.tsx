import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LabSection from "@/components/lab/LabSection";

const Laboratory = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('laboratory.title')} | ConsultIA`;
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <div>
      <div className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{t('laboratory.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            {t('laboratory.pageDescription')}
          </p>
        </div>
      </div>
      <LabSection />
    </div>
  );
};

export default Laboratory;
