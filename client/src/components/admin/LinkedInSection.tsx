import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { useLocation } from "wouter";

export function LinkedInSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [shareText, setShareText] = useState("");

  // Détecter les paramètres de redirection après l'authentification LinkedIn
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedinSuccess = params.get("linkedinSuccess");
    const linkedinError = params.get("linkedinError");

    if (linkedinSuccess === "true") {
      toast({
        title: t("admin.linkedin.successTitle"),
        description: t("admin.linkedin.successDescription"),
        variant: "default",
      });
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (linkedinError === "true") {
      toast({
        title: t("admin.linkedin.errorTitle"),
        description: t("admin.linkedin.errorDescription"),
        variant: "destructive",
      });
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, t]);

  // Récupérer les articles du blog
  const { data: posts } = useQuery({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const response = await apiRequest("/api/posts");
      return response as Post[];
    }
  });

  // Vérifier l'état de connexion à LinkedIn
  const { data: linkedInStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["/api/linkedin/status"],
    queryFn: async () => {
      const response = await apiRequest("/api/linkedin/status");
      return response as { connected: boolean };
    }
  });

  // Mutation pour obtenir l'URL d'authentification LinkedIn
  const { mutate: getAuthUrl, isPending: isAuthPending } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/linkedin/auth");
      return (response as { authUrl: string }).authUrl;
    },
    onSuccess: (authUrl) => {
      window.location.href = authUrl;
    },
    onError: () => {
      toast({
        title: t("admin.linkedin.authErrorTitle"),
        description: t("admin.linkedin.authErrorDescription"),
        variant: "destructive",
      });
    },
  });

  // Mutation pour partager un article sur LinkedIn
  const { mutate: sharePost, isPending: isSharing } = useMutation({
    mutationFn: async () => {
      if (!selectedPost) return null;
      
      // Construire l'URL absolue pour l'article
      const baseUrl = window.location.origin;
      const postUrl = `${baseUrl}/blog/${selectedPost.slug}`;
      
      // Préparer les données pour le partage
      return apiRequest("/api/linkedin/share", {
        method: "POST",
        body: JSON.stringify({
          text: shareText || `Je viens de publier un nouvel article : ${selectedPost.title}`,
          title: selectedPost.title,
          url: postUrl,
          imageUrl: selectedPost.imageUrl
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: t("admin.linkedin.shareSuccessTitle"),
        description: t("admin.linkedin.shareSuccessDescription"),
        variant: "default",
      });
      setSelectedPost(null);
      setShareText("");
    },
    onError: (error) => {
      console.error("Erreur lors du partage:", error);
      toast({
        title: t("admin.linkedin.shareErrorTitle"),
        description: t("admin.linkedin.shareErrorDescription"),
        variant: "destructive",
      });
    },
  });

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setShareText(`Je viens de publier un nouvel article : ${post.title}`);
  };

  const handleShare = () => {
    if (!selectedPost) {
      toast({
        title: t("admin.linkedin.noPostSelectedTitle"),
        description: t("admin.linkedin.noPostSelectedDescription"),
        variant: "destructive",
      });
      return;
    }
    
    sharePost();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">LinkedIn</h2>
          <p className="text-muted-foreground">
            {t("admin.linkedin.description")}
          </p>
        </div>
        
        <div className="flex items-center">
          {isLoadingStatus ? (
            <Badge variant="outline">{t("admin.linkedin.checking")}</Badge>
          ) : linkedInStatus?.connected ? (
            <Badge variant="default" className="bg-green-600">
              {t("admin.linkedin.connected")}
            </Badge>
          ) : (
            <Badge variant="secondary">{t("admin.linkedin.disconnected")}</Badge>
          )}
        </div>
      </div>

      <Separator />

      {!linkedInStatus?.connected && (
        <Alert>
          <SiLinkedin className="h-4 w-4" />
          <AlertTitle>{t("admin.linkedin.connectTitle")}</AlertTitle>
          <AlertDescription>
            {t("admin.linkedin.connectDescription")}
          </AlertDescription>
          <div className="mt-4">
            <Button 
              onClick={() => getAuthUrl()} 
              disabled={isAuthPending}
              className="bg-[#0077B5] hover:bg-[#005e8c]"
            >
              <SiLinkedin className="mr-2 h-4 w-4" />
              {t("admin.linkedin.connectButton")}
            </Button>
          </div>
        </Alert>
      )}

      {linkedInStatus?.connected && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.linkedin.sharePostTitle")}</CardTitle>
              <CardDescription>
                {t("admin.linkedin.sharePostDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    {t("admin.linkedin.selectPost")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts?.map((post: Post) => (
                      <Card 
                        key={post.id} 
                        className={`cursor-pointer transition-all ${
                          selectedPost?.id === post.id 
                            ? "border-2 border-consultia-blue" 
                            : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => handleSelectPost(post)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-medium line-clamp-1">{post.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {post.excerpt || post.content.substring(0, 100)}...
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {selectedPost && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">
                      {t("admin.linkedin.shareMessage")}
                    </h3>
                    <textarea
                      rows={3}
                      value={shareText}
                      onChange={(e) => setShareText(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder={t("admin.linkedin.shareMessagePlaceholder")}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleShare}
                disabled={!selectedPost || isSharing}
                className="bg-[#0077B5] hover:bg-[#005e8c]"
              >
                <SiLinkedin className="mr-2 h-4 w-4" />
                {t("admin.linkedin.shareButton")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}