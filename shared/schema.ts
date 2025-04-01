import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - keeping this from the template for authentication if needed later
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Blog posts schema
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  authorId: integer("author_id").references(() => users.id),
  language: text("language").notNull().default("fr"),
  image: text("image"), // Additional image field for flexibility
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  date: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Application links for Laboratory section
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  url: text("url").notNull(),
  link: text("link"), // Additional field to store external link, similar to url
  order: integer("order").notNull().default(0),
  language: text("language").notNull().default("fr"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Contact forms
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  status: text("status").notNull().default("new"),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  date: true,
  status: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Chatbot QA pairs
export const chatbotQa = pgTable("chatbot_qa", {
  id: serial("id").primaryKey(),
  language: text("language").notNull().default("fr"),
  keywords: text("keywords").array().notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const insertChatbotQaSchema = createInsertSchema(chatbotQa).omit({
  id: true,
});

export type InsertChatbotQa = z.infer<typeof insertChatbotQaSchema>;
export type ChatbotQa = typeof chatbotQa.$inferSelect;
