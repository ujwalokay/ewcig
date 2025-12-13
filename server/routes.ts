import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertTerminalSchema, insertGameSchema, insertStoreItemSchema, insertSessionSchema, insertActivityLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Members
  app.get("/api/members", async (_req, res) => {
    const members = await storage.getMembers();
    res.json(members);
  });

  app.get("/api/members/:id", async (req, res) => {
    const member = await storage.getMember(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  });

  app.post("/api/members", async (req, res) => {
    const parsed = insertMemberSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const member = await storage.createMember(parsed.data);
    await storage.createActivityLog({ type: "member", userId: member.id, message: `New member ${member.username} registered` });
    res.status(201).json(member);
  });

  app.patch("/api/members/:id", async (req, res) => {
    const member = await storage.updateMember(req.params.id, req.body);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  });

  app.delete("/api/members/:id", async (req, res) => {
    await storage.deleteMember(req.params.id);
    res.status(204).send();
  });

  app.post("/api/members/:id/topup", async (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount required" });
    const member = await storage.topUpMember(req.params.id, amount);
    if (!member) return res.status(404).json({ message: "Member not found" });
    await storage.createActivityLog({ type: "topup", userId: member.id, message: `${member.username} topped up $${amount}` });
    res.json(member);
  });

  // Terminals
  app.get("/api/terminals", async (_req, res) => {
    const terminals = await storage.getTerminals();
    res.json(terminals);
  });

  app.get("/api/terminals/:id", async (req, res) => {
    const terminal = await storage.getTerminal(req.params.id);
    if (!terminal) return res.status(404).json({ message: "Terminal not found" });
    res.json(terminal);
  });

  app.post("/api/terminals", async (req, res) => {
    const parsed = insertTerminalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const terminal = await storage.createTerminal(parsed.data);
    res.status(201).json(terminal);
  });

  app.patch("/api/terminals/:id", async (req, res) => {
    const terminal = await storage.updateTerminal(req.params.id, req.body);
    if (!terminal) return res.status(404).json({ message: "Terminal not found" });
    res.json(terminal);
  });

  app.delete("/api/terminals/:id", async (req, res) => {
    await storage.deleteTerminal(req.params.id);
    res.status(204).send();
  });

  // Games
  app.get("/api/games", async (_req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    const game = await storage.getGame(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  });

  app.post("/api/games", async (req, res) => {
    const parsed = insertGameSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const game = await storage.createGame(parsed.data);
    res.status(201).json(game);
  });

  app.patch("/api/games/:id", async (req, res) => {
    const game = await storage.updateGame(req.params.id, req.body);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  });

  app.delete("/api/games/:id", async (req, res) => {
    await storage.deleteGame(req.params.id);
    res.status(204).send();
  });

  // Store Items
  app.get("/api/store-items", async (_req, res) => {
    const items = await storage.getStoreItems();
    res.json(items);
  });

  app.get("/api/store-items/:id", async (req, res) => {
    const item = await storage.getStoreItem(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  });

  app.post("/api/store-items", async (req, res) => {
    const parsed = insertStoreItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const item = await storage.createStoreItem(parsed.data);
    res.status(201).json(item);
  });

  app.patch("/api/store-items/:id", async (req, res) => {
    const item = await storage.updateStoreItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  });

  app.delete("/api/store-items/:id", async (req, res) => {
    await storage.deleteStoreItem(req.params.id);
    res.status(204).send();
  });

  // Sessions
  app.get("/api/sessions", async (_req, res) => {
    const sessions = await storage.getSessions();
    res.json(sessions);
  });

  app.get("/api/sessions/active", async (_req, res) => {
    const sessions = await storage.getActiveSessions();
    res.json(sessions);
  });

  app.post("/api/sessions", async (req, res) => {
    const parsed = insertSessionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const session = await storage.createSession(parsed.data);
    await storage.createActivityLog({ type: "login", userId: session.memberId, message: `Session started on terminal` });
    res.status(201).json(session);
  });

  app.post("/api/sessions/:id/end", async (req, res) => {
    const { totalCost } = req.body;
    const session = await storage.endSession(req.params.id, totalCost || "0.00");
    if (!session) return res.status(404).json({ message: "Session not found" });
    await storage.createActivityLog({ type: "logout", userId: session.memberId, message: `Session ended` });
    res.json(session);
  });

  // Activity Logs
  app.get("/api/activity-logs", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const logs = await storage.getActivityLogs(limit);
    res.json(logs);
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (_req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Seed initial data
  app.post("/api/seed", async (_req, res) => {
    const existingTerminals = await storage.getTerminals();
    if (existingTerminals.length > 0) {
      return res.json({ message: "Data already seeded" });
    }

    // Create terminals
    for (let i = 1; i <= 40; i++) {
      await storage.createTerminal({
        name: `PC ${i.toString().padStart(2, '0')}`,
        zone: i <= 10 ? "VIP Room" : i <= 25 ? "Main Floor" : "Tournament Area",
        status: "Available",
        ipAddress: `192.168.1.${100 + i}`,
        specs: "RTX 4070, i7-13700K, 32GB RAM"
      });
    }

    // Create games
    const gamesData = [
      { name: "Valorant", category: "FPS", isPopular: true, activePlayerCount: 12 },
      { name: "League of Legends", category: "MOBA", isPopular: true, activePlayerCount: 8 },
      { name: "Counter-Strike 2", category: "FPS", isPopular: true, activePlayerCount: 5 },
      { name: "Dota 2", category: "MOBA", isPopular: true, activePlayerCount: 3 },
      { name: "Apex Legends", category: "Battle Royale", isPopular: false, activePlayerCount: 4 },
      { name: "Fortnite", category: "Battle Royale", isPopular: false, activePlayerCount: 2 },
    ];
    for (const game of gamesData) {
      await storage.createGame(game);
    }

    // Create store items
    const storeData = [
      { name: "Red Bull", category: "Drinks", price: "3.50", stock: 50 },
      { name: "Monster Energy", category: "Drinks", price: "3.00", stock: 40 },
      { name: "Coca Cola", category: "Drinks", price: "2.00", stock: 100 },
      { name: "Pizza Slice", category: "Food", price: "4.50", stock: 20 },
      { name: "Nachos", category: "Food", price: "5.00", stock: 15 },
      { name: "Gaming Headset", category: "Accessories", price: "25.00", stock: 5 },
    ];
    for (const item of storeData) {
      await storage.createStoreItem(item);
    }

    // Create sample members
    const membersData = [
      { username: "ProGamer99", realName: "Alex Chen", tier: "Gold" as const, balance: "125.50", points: 4500 },
      { username: "CasualDave", realName: "David Smith", tier: "Silver" as const, balance: "45.00", points: 1200 },
      { username: "JinxMain", realName: "Sarah Jones", tier: "Platinum" as const, balance: "250.00", points: 8900 },
      { username: "NoobSlayer", realName: "Mike Ross", tier: "Bronze" as const, balance: "15.00", points: 300 },
    ];
    for (const member of membersData) {
      await storage.createMember(member);
    }

    await storage.createActivityLog({ type: "system", message: "System initialized with seed data" });

    res.json({ message: "Seed data created successfully" });
  });

  return httpServer;
}
