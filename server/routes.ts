import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthEntrySchema, insertDiaryEntrySchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  setupAuth(app);

  // Auth routes are now handled in auth.ts

  // Get health entry for a specific date (requires authentication)
  app.get("/api/health-entries/:date", isAuthenticated, async (req: any, res) => {
    try {
      const { date } = req.params;
      const userId = req.user.id;
      const entry = await storage.getHealthEntry(userId, date);
      
      if (!entry) {
        return res.status(404).json({ message: "Health entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      console.error("Error getting health entry:", error);
      res.status(500).json({ message: "Failed to get health entry" });
    }
  });

  // Get health entries within a date range (requires authentication)
  app.get("/api/health-entries", isAuthenticated, async (req: any, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;
      const entries = await storage.getHealthEntries(
        userId,
        startDate as string,
        endDate as string
      );
      
      res.json(entries);
    } catch (error) {
      console.error("Error getting health entries:", error);
      res.status(500).json({ message: "Failed to get health entries" });
    }
  });

  // Create or update health entry (requires authentication)
  app.post("/api/health-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertHealthEntrySchema.parse({
        ...req.body,
        userId
      });
      
      // Check if entry already exists for this date
      const existingEntry = await storage.getHealthEntry(userId, validatedData.date);
      
      let entry;
      if (existingEntry) {
        entry = await storage.updateHealthEntry(userId, validatedData.date, validatedData);
      } else {
        entry = await storage.createHealthEntry(validatedData);
      }
      
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error saving health entry:", error);
      res.status(500).json({ message: "Failed to save health entry" });
    }
  });

  // Update health entry (requires authentication)
  app.put("/api/health-entries/:date", isAuthenticated, async (req: any, res) => {
    try {
      const { date } = req.params;
      const userId = req.user.id;
      const updateData = insertHealthEntrySchema.partial().parse(req.body);
      
      const entry = await storage.updateHealthEntry(userId, date, updateData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update health entry" });
    }
  });

  // Delete health entry (requires authentication)
  app.delete("/api/health-entries/:date", isAuthenticated, async (req: any, res) => {
    try {
      const { date } = req.params;
      const userId = req.user.id;
      const deleted = await storage.deleteHealthEntry(userId, date);
      
      if (!deleted) {
        return res.status(404).json({ message: "Health entry not found" });
      }
      
      res.json({ message: "Health entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete health entry" });
    }
  });

  // Diary entry routes

  // Get all diary entries for user (requires authentication)
  app.get("/api/diary-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const entries = await storage.getDiaryEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error getting diary entries:", error);
      res.status(500).json({ message: "Failed to get diary entries" });
    }
  });

  // Get specific diary entry (requires authentication)
  app.get("/api/diary-entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getDiaryEntry(parseInt(id));
      
      if (!entry) {
        return res.status(404).json({ message: "Diary entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      console.error("Error getting diary entry:", error);
      res.status(500).json({ message: "Failed to get diary entry" });
    }
  });

  // Create diary entry (requires authentication)
  app.post("/api/diary-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertDiaryEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createDiaryEntry(validatedData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating diary entry:", error);
      res.status(500).json({ message: "Failed to create diary entry" });
    }
  });

  // Update diary entry (requires authentication)
  app.put("/api/diary-entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = insertDiaryEntrySchema.partial().parse(req.body);
      
      const entry = await storage.updateDiaryEntry(parseInt(id), updateData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating diary entry:", error);
      res.status(500).json({ message: "Failed to update diary entry" });
    }
  });

  // Delete diary entry (requires authentication)
  app.delete("/api/diary-entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDiaryEntry(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Diary entry not found" });
      }
      
      res.json({ message: "Diary entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      res.status(500).json({ message: "Failed to delete diary entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
