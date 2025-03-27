import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ContactSection from "@/components/contact/ContactSection";

const Contact = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('contact.title')} | ConsultIA`;
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <div>
      <div className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            {t('contact.pageDescription')}
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
};

export default Contact;
