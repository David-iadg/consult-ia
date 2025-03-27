import { useEffect } from "react";
import { useLocation } from "wouter";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import LabSection from "@/components/lab/LabSection";
import BlogSection from "@/components/blog/BlogSection";
import ContactSection from "@/components/contact/ContactSection";

const Home = () => {
  const [location] = useLocation();

  // Handle hash navigation for smooth scrolling
  useEffect(() => {
    if (location.includes('#')) {
      const id = location.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // Scroll to top when navigating to the home page without hash
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <LabSection />
      <BlogSection limit={3} />
      <ContactSection />
    </>
  );
};

export default Home;
