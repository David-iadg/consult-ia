import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

const LabSection = () => {
  const { t } = useTranslation();
  
  const { data: applications = [] } = useQuery({
    queryKey: ['/api/applications'],
  });

  // Fallback applications if API hasn't responded yet
  const fallbackApplications = [
    {
      id: 1,
      icon: "fas fa-robot",
      title: t('laboratory.apps.assistant.title'),
      description: t('laboratory.apps.assistant.description'),
      url: "#"
    },
    {
      id: 2,
      icon: "fas fa-chart-line",
      title: t('laboratory.apps.dataviz.title'),
      description: t('laboratory.apps.dataviz.description'),
      url: "#"
    },
    {
      id: 3,
      icon: "fas fa-tasks",
      title: t('laboratory.apps.processflow.title'),
      description: t('laboratory.apps.processflow.description'),
      url: "#"
    },
    {
      id: 4,
      icon: "fas fa-file-contract",
      title: t('laboratory.apps.docugenius.title'),
      description: t('laboratory.apps.docugenius.description'),
      url: "#"
    },
    {
      id: 5,
      icon: "fas fa-comments",
      title: t('laboratory.apps.chatintegrator.title'),
      description: t('laboratory.apps.chatintegrator.description'),
      url: "#"
    },
    {
      id: 6,
      icon: "fas fa-lightbulb",
      title: t('laboratory.apps.idealab.title'),
      description: t('laboratory.apps.idealab.description'),
      url: "#"
    }
  ];

  const displayedApps = applications.length > 0 ? applications : fallbackApplications;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-inter mb-4">{t('laboratory.title')}</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            {t('laboratory.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayedApps.map((app) => (
            <a key={app.id} href={app.url} className="group">
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-primary hover:border-opacity-50 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <i className={`${app.icon} text-primary text-3xl group-hover:text-white transition-colors`}></i>
                </div>
                <h3 className="text-xl font-bold font-inter mb-3">{app.title}</h3>
                <p className="text-gray-600">
                  {app.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LabSection;
