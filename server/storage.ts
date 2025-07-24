import { healthEntries, users, diaryEntries, type HealthEntry, type InsertHealthEntry, type User, type UpsertUser, type DiaryEntry, type InsertDiaryEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations for email/password auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<UpsertUser, 'id'>): Promise<User>;
  
  // Health entry operations
  createHealthEntry(entry: InsertHealthEntry): Promise<HealthEntry>;
  updateHealthEntry(userId: string, date: string, entry: Partial<InsertHealthEntry>): Promise<HealthEntry>;
  getHealthEntry(userId: string, date: string): Promise<HealthEntry | undefined>;
  getHealthEntries(userId: string, startDate?: string, endDate?: string): Promise<HealthEntry[]>;
  deleteHealthEntry(userId: string, date: string): Promise<boolean>;
  
  // Diary entry operations
  createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry>;
  updateDiaryEntry(id: number, entry: Partial<InsertDiaryEntry>): Promise<DiaryEntry>;
  getDiaryEntry(id: number): Promise<DiaryEntry | undefined>;
  getDiaryEntries(userId: string): Promise<DiaryEntry[]>;
  deleteDiaryEntry(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {

  // User operations for email/password auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({
        id,
        ...userData,
      })
      .returning();
    return user;
  }

  async createHealthEntry(insertEntry: InsertHealthEntry): Promise<HealthEntry> {
    // Calculate overall score as average of all metrics
    const overallScore = Math.round(
      (insertEntry.sleepScore + insertEntry.nutritionScore + insertEntry.exerciseScore + 
       insertEntry.hydrationScore + insertEntry.moodScore) / 5
    );

    const entryWithScore = {
      ...insertEntry,
      overallScore,
    };

    const [entry] = await db
      .insert(healthEntries)
      .values(entryWithScore)
      .returning();
    return entry;
  }

  async updateHealthEntry(userId: string, date: string, updateEntry: Partial<InsertHealthEntry>): Promise<HealthEntry> {
    const existing = await this.getHealthEntry(userId, date);
    if (!existing) {
      throw new Error(`Health entry for date ${date} not found`);
    }

    const updated = { ...existing, ...updateEntry };
    
    // Recalculate overall score
    updated.overallScore = Math.round(
      (updated.sleepScore + updated.nutritionScore + updated.exerciseScore + 
       updated.hydrationScore + updated.moodScore) / 5
    );

    const [entry] = await db
      .update(healthEntries)
      .set(updated)
      .where(and(eq(healthEntries.userId, userId), eq(healthEntries.date, date)))
      .returning();
    
    return entry;
  }

  async getHealthEntry(userId: string, date: string): Promise<HealthEntry | undefined> {
    const [entry] = await db.select().from(healthEntries).where(
      and(eq(healthEntries.userId, userId), eq(healthEntries.date, date))
    );
    return entry || undefined;
  }

  async getHealthEntries(userId: string, startDate?: string, endDate?: string): Promise<HealthEntry[]> {
    let entries: HealthEntry[];
    const userCondition = eq(healthEntries.userId, userId);

    if (startDate && endDate) {
      entries = await db.select().from(healthEntries).where(
        and(
          userCondition,
          gte(healthEntries.date, startDate),
          lte(healthEntries.date, endDate)
        )
      );
    } else if (startDate) {
      entries = await db.select().from(healthEntries).where(
        and(userCondition, gte(healthEntries.date, startDate))
      );
    } else if (endDate) {
      entries = await db.select().from(healthEntries).where(
        and(userCondition, lte(healthEntries.date, endDate))
      );
    } else {
      entries = await db.select().from(healthEntries).where(userCondition);
    }

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async deleteHealthEntry(userId: string, date: string): Promise<boolean> {
    const result = await db.delete(healthEntries).where(
      and(eq(healthEntries.userId, userId), eq(healthEntries.date, date))
    );
    return (result.rowCount ?? 0) > 0;
  }

  // Diary entry operations
  async createDiaryEntry(insertEntry: InsertDiaryEntry): Promise<DiaryEntry> {
    const [entry] = await db
      .insert(diaryEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateDiaryEntry(id: number, updateEntry: Partial<InsertDiaryEntry>): Promise<DiaryEntry> {
    const [entry] = await db
      .update(diaryEntries)
      .set({ ...updateEntry, updatedAt: new Date() })
      .where(eq(diaryEntries.id, id))
      .returning();
    
    if (!entry) {
      throw new Error(`Diary entry with id ${id} not found`);
    }
    
    return entry;
  }

  async getDiaryEntry(id: number): Promise<DiaryEntry | undefined> {
    const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id));
    return entry || undefined;
  }

  async getDiaryEntries(userId: string): Promise<DiaryEntry[]> {
    const entries = await db
      .select()
      .from(diaryEntries)
      .where(eq(diaryEntries.userId, userId))
      .orderBy(desc(diaryEntries.createdAt));
    
    return entries;
  }

  async deleteDiaryEntry(id: number): Promise<boolean> {
    const result = await db.delete(diaryEntries).where(eq(diaryEntries.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
