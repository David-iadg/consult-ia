import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Application } from "@shared/schema";

export function LabAdminSection() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState<string>("");
  const [url, setUrl] = useState<string>(""); // Renamed from link to url to match schema
  const [icon, setIcon] = useState("");
  const [language, setLanguage] = useState(i18n.language || "fr");
  const [order, setOrder] = useState(0);
  
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"]
  });
  
  const createAppMutation = useMutation({
    mutationFn: async (newApp: Omit<Application, "id">) => {
      return apiRequest("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApp)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: t("admin.lab.createSuccess"),
        description: t("admin.lab.appCreated")
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("admin.lab.createError"),
        description: t("admin.lab.tryAgain"),
        variant: "destructive"
      });
    }
  });
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setUrl("");
    setIcon("");
    setLanguage(i18n.language || "fr");
    setOrder(0);
    setEditingApp(null);
  };
  
  const handleOpenDialog = (app?: Application) => {
    if (app) {
      // Edit mode (not implemented yet)
      setEditingApp(app);
      setTitle(app.title);
      setDescription(app.description);
      setLink(app.link || "");
      setUrl(app.url);
      setIcon(app.icon || "");
      setLanguage(app.language);
      setOrder(app.order);
    } else {
      // Create mode
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appData = {
      title,
      description,
      link,
      url: url || link, // Use link as fallback
      icon,
      language,
      order
    };
    
    createAppMutation.mutate(appData);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("admin.lab.manageApps")}</h2>
        <Button onClick={() => handleOpenDialog()}>
          {t("admin.lab.createApp")}
        </Button>
      </div>
      
      <Tabs defaultValue="fr">
        <TabsList>
          <TabsTrigger value="fr">Français</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="es">Español</TabsTrigger>
        </TabsList>
        
        {["fr", "en", "es"].map(lang => (
          <TabsContent key={lang} value={lang}>
            {isLoading ? (
              <div className="text-center py-8">
                <p>{t("admin.loading")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">{t("admin.lab.id")}</TableHead>
                    <TableHead>{t("admin.lab.title")}</TableHead>
                    <TableHead>{t("admin.lab.link")}</TableHead>
                    <TableHead className="text-right">{t("admin.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.filter(app => app.language === lang).map(app => (
                    <TableRow key={app.id}>
                      <TableCell>{app.id}</TableCell>
                      <TableCell>{app.title}</TableCell>
                      <TableCell>
                        <a href={app.link || ''} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {app.link || t("admin.lab.noLink")}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(app)}>
                          {t("admin.edit")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {applications.filter(app => app.language === lang).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {t("admin.lab.noApps")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingApp ? t("admin.lab.editApp") : t("admin.lab.createApp")}
            </DialogTitle>
            <DialogDescription>
              {t("admin.lab.fillAppDetails")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="title">{t("admin.lab.title")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="language">{t("admin.language")}</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">{t("admin.lab.description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="link">{t("admin.lab.link")}</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="icon">{t("admin.lab.icon")}</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="lucide:beaker"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit">
                {editingApp ? t("admin.save") : t("admin.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}