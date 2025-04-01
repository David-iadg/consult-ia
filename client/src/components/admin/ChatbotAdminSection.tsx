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
import { ChatbotQa } from "@shared/schema";

export function ChatbotAdminSection() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQa, setEditingQa] = useState<ChatbotQa | null>(null);
  
  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState(i18n.language || "fr");
  
  const { data: qaItems = [], isLoading } = useQuery({
    queryKey: ["/api/chatbot/qa"],
    queryFn: async () => {
      // Get all languages
      const fr = await apiRequest("/api/chatbot/qa?lang=fr");
      const en = await apiRequest("/api/chatbot/qa?lang=en");
      const es = await apiRequest("/api/chatbot/qa?lang=es");
      return [...fr, ...en, ...es];
    }
  });
  
  const createQaMutation = useMutation({
    mutationFn: async (newQa: Omit<ChatbotQa, "id">) => {
      return apiRequest("/api/chatbot/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQa)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chatbot/qa"] });
      toast({
        title: t("admin.chatbot.createSuccess"),
        description: t("admin.chatbot.qaCreated")
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("admin.chatbot.createError"),
        description: t("admin.chatbot.tryAgain"),
        variant: "destructive"
      });
    }
  });
  
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setKeywords("");
    setLanguage(i18n.language || "fr");
    setEditingQa(null);
  };
  
  const handleOpenDialog = (qa?: ChatbotQa) => {
    if (qa) {
      // Edit mode (not implemented yet)
      setEditingQa(qa);
      setQuestion(qa.question);
      setAnswer(qa.answer);
      setKeywords(qa.keywords.join(", "));
      setLanguage(qa.language);
    } else {
      // Create mode
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const keywordsArray = keywords
      .split(",")
      .map(k => k.trim())
      .filter(k => k);
    
    const qaData = {
      question,
      answer,
      keywords: keywordsArray,
      language
    };
    
    createQaMutation.mutate(qaData);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("admin.chatbot.manageQa")}</h2>
        <Button onClick={() => handleOpenDialog()}>
          {t("admin.chatbot.createQa")}
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
                    <TableHead className="w-[50px]">{t("admin.chatbot.id")}</TableHead>
                    <TableHead>{t("admin.chatbot.question")}</TableHead>
                    <TableHead>{t("admin.chatbot.keywords")}</TableHead>
                    <TableHead className="text-right">{t("admin.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qaItems.filter(qa => qa.language === lang).map(qa => (
                    <TableRow key={qa.id}>
                      <TableCell>{qa.id}</TableCell>
                      <TableCell>{qa.question}</TableCell>
                      <TableCell>{qa.keywords.join(", ")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(qa)}>
                          {t("admin.edit")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {qaItems.filter(qa => qa.language === lang).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {t("admin.chatbot.noQa")}
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
              {editingQa ? t("admin.chatbot.editQa") : t("admin.chatbot.createQa")}
            </DialogTitle>
            <DialogDescription>
              {t("admin.chatbot.fillQaDetails")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="question">{t("admin.chatbot.question")}</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
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
              <Label htmlFor="keywords">{t("admin.chatbot.keywords")}</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="mot-clé1, mot-clé2, mot-clé3"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t("admin.chatbot.keywordsHelp")}
              </p>
            </div>
            
            <div>
              <Label htmlFor="answer">{t("admin.chatbot.answer")}</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="h-48"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit">
                {editingQa ? t("admin.save") : t("admin.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}