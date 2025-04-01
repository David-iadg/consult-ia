import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: "fas fa-digital-tachograph",
      title: t('services.digital.title'),
      description: t('services.digital.description'),
    },
    {
      icon: "fas fa-sitemap",
      title: t('services.organization.title'),
      description: t('services.organization.description'),
    },
    {
      icon: "fas fa-brain",
      title: t('services.ai.title'),
      description: t('services.ai.description'),
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-inter mb-4">{t('services.title')}</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-consultia-blue">
              <div className="w-14 h-14 bg-consultia-blue bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <i className={`${service.icon} text-consultia-blue text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold font-inter mb-3 text-consultia-darkGray">{service.title}</h3>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <a href="#" className="flex items-center text-consultia-blue font-medium hover:underline">
                <span>{t('services.learnMore')}</span>
                <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
