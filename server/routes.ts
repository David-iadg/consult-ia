import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import {
  insertPostSchema,
  insertApplicationSchema,
  insertContactSubmissionSchema,
  insertUserSchema,
  insertChatbotQaSchema
} from "@shared/schema";
import * as linkedInService from "./services/linkedin";
import session from "express-session";
import MemoryStore from "memorystore";

// Define custom session type with userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    linkedinState?: string;
  }
}

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'consultIA-dev-secret'
  }));

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username 
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  // API routes - prefix with /api
  
  // Blog posts
  app.get("/api/posts", async (_req: Request, res: Response) => {
    const posts = await storage.getAllPosts();
    res.json(posts);
  });
  
  app.get("/api/posts/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const post = await storage.getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.json(post);
  });
  
  app.post("/api/posts", requireAuth, async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const newPost = await storage.createPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  
  app.put("/api/posts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Partial validation for update
      const updateData = req.body;
      const updatedPost = await storage.updatePost(id, updateData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });
  
  app.delete("/api/posts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deletePost(id);
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  
  // Applications
  app.get("/api/applications", async (_req: Request, res: Response) => {
    const applications = await storage.getAllApplications();
    res.json(applications);
  });
  
  app.get("/api/applications/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const application = await storage.getApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.json(application);
  });
  
  app.post("/api/applications", requireAuth, async (req: Request, res: Response) => {
    try {
      const appData = insertApplicationSchema.parse(req.body);
      const newApp = await storage.createApplication(appData);
      res.status(201).json(newApp);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  
  // Contact form submissions
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const contactData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      res.status(201).json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid contact form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });
  
  app.get("/api/contact/submissions", requireAuth, async (_req: Request, res: Response) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });
  
  // Chatbot API
  app.get("/api/chatbot/qa", async (req: Request, res: Response) => {
    // Support both 'language' and 'lang' query parameters for flexibility
    const language = (req.query.language || req.query.lang) as string || "fr";
    const qaItems = await storage.getAllChatbotQa(language);
    res.json(qaItems);
  });
  
  app.post("/api/chatbot/qa", requireAuth, async (req: Request, res: Response) => {
    try {
      const qaData = insertChatbotQaSchema.parse(req.body);
      const newQa = await storage.createChatbotQa(qaData);
      res.status(201).json(newQa);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid chatbot QA data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create chatbot QA" });
    }
  });

  // LinkedIn Integration
  app.get("/api/linkedin/auth", requireAuth, (req: Request, res: Response) => {
    try {
      // Générer un état unique pour prévenir les attaques CSRF
      const state = Math.random().toString(36).substring(2, 15);
      req.session.linkedinState = state;

      // Générer l'URL d'autorisation
      const authUrl = linkedInService.getAuthorizationUrl(state);
      res.json({ authUrl });
    } catch (error) {
      console.error("Erreur d'authentification LinkedIn:", error);
      res.status(500).json({ message: "Erreur lors de l'initialisation de l'authentification LinkedIn" });
    }
  });

  app.get("/api/auth/linkedin/callback", async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;
      
      // Vérifier l'état pour éviter les attaques CSRF
      if (!state || state !== req.session.linkedinState) {
        return res.status(403).json({ message: "État non valide" });
      }

      if (!req.session.userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }

      if (!code) {
        return res.status(400).json({ message: "Code d'autorisation manquant" });
      }

      // Échanger le code contre un jeton d'accès
      const accessToken = await linkedInService.getAccessToken(code as string);
      
      // Stocker le jeton d'accès
      linkedInService.storeAccessToken(req.session.userId, accessToken);

      // Rediriger vers la page d'administration
      res.redirect('/admin?linkedinSuccess=true');
    } catch (error) {
      console.error("Erreur lors du callback LinkedIn:", error);
      res.redirect('/admin?linkedinError=true');
    }
  });

  app.get("/api/linkedin/status", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ connected: false });
      }

      const accessToken = linkedInService.getStoredAccessToken(req.session.userId);
      if (!accessToken) {
        return res.json({ connected: false });
      }

      // Vérifier si le jeton est valide
      const isValid = await linkedInService.verifyAccessToken(accessToken);
      res.json({ connected: isValid });
    } catch (error) {
      res.json({ connected: false });
    }
  });

  app.post("/api/linkedin/share", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }

      const accessToken = linkedInService.getStoredAccessToken(req.session.userId);
      if (!accessToken) {
        return res.status(400).json({ message: "Non connecté à LinkedIn" });
      }

      const { text, title, url, imageUrl } = req.body;
      if (!text || !title || !url) {
        return res.status(400).json({ message: "Informations incomplètes pour le partage" });
      }

      // Partager le contenu
      const result = await linkedInService.sharePost(accessToken, { text, title, url, imageUrl });
      res.json({ success: true, result });
    } catch (error) {
      console.error("Erreur lors du partage sur LinkedIn:", error);
      res.status(500).json({ 
        message: "Erreur lors du partage sur LinkedIn", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
