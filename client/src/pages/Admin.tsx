import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BlogAdminSection } from "../components/admin/BlogAdminSection";
import { LabAdminSection } from "../components/admin/LabAdminSection";
import { ChatbotAdminSection } from "../components/admin/ChatbotAdminSection";
import { ContactSubmissionsSection } from "../components/admin/ContactSubmissionsSection";
import { LinkedInSection } from "../components/admin/LinkedInSection";

export default function Admin() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiRequest("/api/auth/user");
        if (user) {
          setAuthenticated(true);
        } else {
          setLocation("/login");
        }
      } catch (error) {
        toast({
          title: t("admin.authError"),
          description: t("admin.pleaseLogin"),
          variant: "destructive"
        });
        setLocation("/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [t, toast, setLocation]);
  
  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      toast({
        title: t("admin.logoutSuccess"),
        description: t("admin.loggedOut")
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: t("admin.logoutError"),
        description: t("admin.tryAgain"),
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t("admin.loading")}</h2>
        </div>
      </div>
    );
  }
  
  if (!authenticated) {
    return null; // Redirect handled in useEffect
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
        <Button variant="outline" onClick={handleLogout}>
          {t("admin.logout")}
        </Button>
      </div>
      
      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="blog">{t("admin.blogs")}</TabsTrigger>
          <TabsTrigger value="lab">{t("admin.applications")}</TabsTrigger>
          <TabsTrigger value="chatbot">{t("admin.chatbot")}</TabsTrigger>
          <TabsTrigger value="contacts">{t("admin.contacts")}</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.blogs")}</CardTitle>
              <CardDescription>{t("admin.blogsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogAdminSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.applications")}</CardTitle>
              <CardDescription>{t("admin.applicationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LabAdminSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.chatbot")}</CardTitle>
              <CardDescription>{t("admin.chatbotDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatbotAdminSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.contacts")}</CardTitle>
              <CardDescription>{t("admin.contactsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactSubmissionsSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.linkedin.title")}</CardTitle>
              <CardDescription>{t("admin.linkedin.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LinkedInSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}