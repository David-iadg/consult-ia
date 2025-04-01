import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Post } from "@shared/schema";

export function BlogAdminSection() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [language, setLanguage] = useState(i18n.language || "fr");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("general");
  
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts"],
    select: (data: Post[]) => data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (newPost: Omit<Post, "id" | "date">) => {
      return apiRequest("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: t("admin.blog.createSuccess"),
        description: t("admin.blog.postCreated")
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("admin.blog.createError"),
        description: t("admin.blog.tryAgain"),
        variant: "destructive"
      });
    }
  });
  
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number, [key: string]: any }) => {
      return apiRequest(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: t("admin.blog.updateSuccess"),
        description: t("admin.blog.postUpdated")
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("admin.blog.updateError"),
        description: t("admin.blog.tryAgain"),
        variant: "destructive"
      });
    }
  });
  
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/posts/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: t("admin.blog.deleteSuccess"),
        description: t("admin.blog.postDeleted")
      });
    },
    onError: () => {
      toast({
        title: t("admin.blog.deleteError"),
        description: t("admin.blog.tryAgain"),
        variant: "destructive"
      });
    }
  });
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setSlug("");
    setImage("");
    setLanguage(i18n.language || "fr");
    setExcerpt("");
    setCategory("general");
    setEditingPost(null);
  };
  
  const handleOpenDialog = (post?: Post) => {
    if (post) {
      // Edit mode
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setSlug(post.slug);
      setImage(post.image || "");
      setLanguage(post.language);
      setExcerpt(post.excerpt || "");
      setCategory(post.category || "general");
    } else {
      // Create mode
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title,
      content,
      slug,
      image,
      language,
      excerpt: excerpt || title.substring(0, 100) + "...", // Use title as fallback
      category,
      imageUrl: image, // Map image to imageUrl
      authorId: null
    };
    
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, ...postData });
    } else {
      createPostMutation.mutate(postData);
    }
  };
  
  const handleDeletePost = (post: Post) => {
    if (window.confirm(t("admin.blog.confirmDelete"))) {
      deletePostMutation.mutate(post.id);
    }
  };
  
  const generateSlug = () => {
    const slugified = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setSlug(slugified);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("admin.blog.managePosts")}</h2>
        <Button onClick={() => handleOpenDialog()}>
          {t("admin.blog.createPost")}
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
                    <TableHead className="w-[50px]">{t("admin.blog.id")}</TableHead>
                    <TableHead>{t("admin.blog.title")}</TableHead>
                    <TableHead>{t("admin.blog.date")}</TableHead>
                    <TableHead className="text-right">{t("admin.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.filter(post => post.language === lang).map(post => (
                    <TableRow key={post.id}>
                      <TableCell>{post.id}</TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(post)}>
                          {t("admin.edit")}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post)}>
                          {t("admin.delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {posts.filter(post => post.language === lang).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {t("admin.blog.noPosts")}
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
              {editingPost ? t("admin.blog.editPost") : t("admin.blog.createPost")}
            </DialogTitle>
            <DialogDescription>
              {t("admin.blog.fillPostDetails")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="title">{t("admin.blog.title")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => !slug && generateSlug()}
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
              <Label htmlFor="slug">{t("admin.blog.slug")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  {t("admin.blog.generateSlug")}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">{t("admin.blog.imageUrl")}</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="excerpt">{t("admin.blog.excerpt")}</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="h-20"
                  placeholder={t("admin.blog.excerptPlaceholder")}
                />
              </div>
              
              <div>
                <Label htmlFor="category">{t("admin.blog.category")}</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="general">{t("admin.blog.categoryGeneral")}</option>
                  <option value="technology">{t("admin.blog.categoryTechnology")}</option>
                  <option value="business">{t("admin.blog.categoryBusiness")}</option>
                  <option value="ai">{t("admin.blog.categoryAI")}</option>
                  <option value="consulting">{t("admin.blog.categoryConsulting")}</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">{t("admin.blog.content")}</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-48"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit">
                {editingPost ? t("admin.save") : t("admin.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}