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
import session from "express-session";
import MemoryStore from "memorystore";

// Define custom session type with userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
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

  const httpServer = createServer(app);
  return httpServer;
}
