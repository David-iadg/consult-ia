import { Link } from "wouter";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold font-inter mb-4">ConsultIA</div>
            <p className="text-gray-300 mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium font-inter mb-4">{t('footer.services.title')}</h3>
            <ul className="space-y-2">
              <li><Link href="/#services" className="text-gray-300 hover:text-white transition-colors">{t('footer.services.digital')}</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-white transition-colors">{t('footer.services.organization')}</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-white transition-colors">{t('footer.services.ai')}</Link></li>
              <li><Link href="/#services" className="text-gray-300 hover:text-white transition-colors">{t('footer.services.strategy')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium font-inter mb-4">{t('footer.resources.title')}</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">{t('footer.resources.blog')}</Link></li>
              <li><Link href="/laboratory" className="text-gray-300 hover:text-white transition-colors">{t('footer.resources.casestudies')}</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.resources.whitepapers')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.resources.faq')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium font-inter mb-4">{t('footer.contact.title')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <i className="fas fa-envelope mr-2"></i>
                <span>contact@consultia.fr</span>
              </li>
              <li className="flex items-center text-gray-300">
                <i className="fas fa-phone mr-2"></i>
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center text-gray-300">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>123 Avenue de l'Innovation, Paris</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} ConsultIA. {t('footer.rights')}
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.legal')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
