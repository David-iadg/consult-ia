import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import {
  insertPostSchema,
  insertApplicationSchema,
  insertContactSubmissionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
  
  app.post("/api/posts", async (req: Request, res: Response) => {
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
  
  app.put("/api/posts/:id", async (req: Request, res: Response) => {
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
  
  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
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
  
  app.post("/api/applications", async (req: Request, res: Response) => {
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
  
  // Chatbot API
  app.get("/api/chatbot/qa", async (req: Request, res: Response) => {
    // Support both 'language' and 'lang' query parameters for flexibility
    const language = (req.query.language || req.query.lang) as string || "fr";
    const qaItems = await storage.getAllChatbotQa(language);
    res.json(qaItems);
  });

  const httpServer = createServer(app);
  return httpServer;
}
