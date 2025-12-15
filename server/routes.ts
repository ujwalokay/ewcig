import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertTerminalSchema, insertGameSchema, insertStoreItemSchema, insertSessionSchema, insertActivityLogSchema, insertTimePackageSchema, insertHappyHourSchema, insertNotificationSchema } from "@shared/schema";
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

  // Terminal Session (for Tauri client)
  app.get("/api/terminals/:id/session", async (req, res) => {
    const terminal = await storage.getTerminal(req.params.id);
    if (!terminal) {
      return res.json({
        active: false,
        username: "",
        timeRemaining: 0,
        balance: 0,
        memberTier: "Guest",
        durationMinutes: 0
      });
    }
    
    const sessions = await storage.getActiveSessions();
    const activeSession = sessions.find(s => s.terminalId === req.params.id);
    
    if (!activeSession) {
      return res.json({
        active: false,
        username: "",
        timeRemaining: 0,
        balance: 0,
        memberTier: "Guest",
        durationMinutes: 0
      });
    }

    const member = await storage.getMember(activeSession.memberId);
    const startTime = new Date(activeSession.startTime).getTime();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalDurationSeconds = (activeSession.durationMinutes || 120) * 60;
    const timeRemaining = Math.max(0, totalDurationSeconds - elapsed);

    res.json({
      active: true,
      username: member?.username || "Guest",
      timeRemaining,
      balance: parseFloat(member?.balance || "0"),
      memberTier: member?.tier || "Bronze",
      durationMinutes: activeSession.durationMinutes || 120,
      sessionId: activeSession.id,
      startTime: activeSession.startTime
    });
  });

  // Orders (for Tauri client food orders)
  app.post("/api/orders", async (req, res) => {
    const { terminalId, item, price } = req.body;
    await storage.createActivityLog({ 
      type: "order", 
      message: `Order placed: ${item} ($${price}) from terminal ${terminalId}` 
    });
    res.status(201).json({ success: true, message: "Order placed" });
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
    
    const member = await storage.getMember(parsed.data.memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });
    
    let totalCost = "0.00";
    if (parsed.data.timePackageId) {
      const pkg = await storage.getTimePackage(parsed.data.timePackageId);
      if (pkg) {
        const currentHappyHour = await storage.getCurrentHappyHour();
        let price = parseFloat(pkg.price);
        if (currentHappyHour) {
          price = price * (1 - currentHappyHour.discountPercent / 100);
        }
        totalCost = price.toFixed(2);
        
        if (parseFloat(member.balance) < price) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        
        await storage.deductMemberBalance(member.id, totalCost);
      }
    }
    
    const session = await storage.createSession({ ...parsed.data, totalCost });
    await storage.createActivityLog({ type: "login", userId: session.memberId, message: `Session started on terminal, charged $${totalCost}` });
    
    if (parseFloat(member.balance) - parseFloat(totalCost) < 10) {
      await storage.createNotification({
        type: "low_balance",
        title: "Low Balance Alert",
        message: `Member ${member.username} has low balance ($${(parseFloat(member.balance) - parseFloat(totalCost)).toFixed(2)})`,
        userId: member.id
      });
    }
    
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

  // Time Packages
  app.get("/api/time-packages", async (_req, res) => {
    const packages = await storage.getTimePackages();
    res.json(packages);
  });

  app.get("/api/time-packages/active", async (_req, res) => {
    const packages = await storage.getActiveTimePackages();
    res.json(packages);
  });

  app.get("/api/time-packages/:id", async (req, res) => {
    const pkg = await storage.getTimePackage(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Time package not found" });
    res.json(pkg);
  });

  app.post("/api/time-packages", async (req, res) => {
    const parsed = insertTimePackageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const pkg = await storage.createTimePackage(parsed.data);
    res.status(201).json(pkg);
  });

  app.patch("/api/time-packages/:id", async (req, res) => {
    const pkg = await storage.updateTimePackage(req.params.id, req.body);
    if (!pkg) return res.status(404).json({ message: "Time package not found" });
    res.json(pkg);
  });

  app.delete("/api/time-packages/:id", async (req, res) => {
    await storage.deleteTimePackage(req.params.id);
    res.status(204).send();
  });

  // Happy Hours
  app.get("/api/happy-hours", async (_req, res) => {
    const hours = await storage.getHappyHours();
    res.json(hours);
  });

  app.get("/api/happy-hours/active", async (_req, res) => {
    const hours = await storage.getActiveHappyHours();
    res.json(hours);
  });

  app.get("/api/happy-hours/current", async (_req, res) => {
    const current = await storage.getCurrentHappyHour();
    res.json(current || null);
  });

  app.get("/api/happy-hours/:id", async (req, res) => {
    const hh = await storage.getHappyHour(req.params.id);
    if (!hh) return res.status(404).json({ message: "Happy hour not found" });
    res.json(hh);
  });

  app.post("/api/happy-hours", async (req, res) => {
    const parsed = insertHappyHourSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const hh = await storage.createHappyHour(parsed.data);
    await storage.createActivityLog({ type: "system", message: `Happy hour "${hh.name}" created` });
    res.status(201).json(hh);
  });

  app.patch("/api/happy-hours/:id", async (req, res) => {
    const hh = await storage.updateHappyHour(req.params.id, req.body);
    if (!hh) return res.status(404).json({ message: "Happy hour not found" });
    res.json(hh);
  });

  app.delete("/api/happy-hours/:id", async (req, res) => {
    await storage.deleteHappyHour(req.params.id);
    res.status(204).send();
  });

  // System Settings
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSystemSettings();
    res.json(settings);
  });

  app.get("/api/settings/:key", async (req, res) => {
    const setting = await storage.getSystemSetting(req.params.key);
    if (!setting) return res.status(404).json({ message: "Setting not found" });
    res.json(setting);
  });

  app.put("/api/settings/:key", async (req, res) => {
    const { value, description } = req.body;
    if (!value) return res.status(400).json({ message: "Value required" });
    const setting = await storage.setSystemSetting(req.params.key, value, description);
    res.json(setting);
  });

  app.delete("/api/settings/:key", async (req, res) => {
    await storage.deleteSystemSetting(req.params.key);
    res.status(204).send();
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    const userId = req.query.userId as string | undefined;
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  });

  app.get("/api/notifications/unread", async (req, res) => {
    const userId = req.query.userId as string | undefined;
    const notifications = await storage.getUnreadNotifications(userId);
    res.json(notifications);
  });

  app.post("/api/notifications", async (req, res) => {
    const parsed = insertNotificationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const notification = await storage.createNotification(parsed.data);
    res.status(201).json(notification);
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    const notification = await storage.markNotificationRead(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  });

  app.post("/api/notifications/mark-all-read", async (req, res) => {
    const userId = req.query.userId as string | undefined;
    await storage.markAllNotificationsRead(userId);
    res.json({ message: "All notifications marked as read" });
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    await storage.deleteNotification(req.params.id);
    res.status(204).send();
  });

  // Member Search
  app.get("/api/members/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const members = await storage.searchMembers(query);
    res.json(members);
  });

  // Reports
  app.get("/api/reports/revenue", async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const report = await storage.getRevenueReport(startDate, endDate);
    res.json(report);
  });

  app.get("/api/reports/usage", async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const report = await storage.getUsageReport(startDate, endDate);
    res.json(report);
  });

  // Get price with happy hour discount
  app.get("/api/pricing/calculate", async (req, res) => {
    const basePrice = parseFloat(req.query.price as string) || 0;
    const currentHappyHour = await storage.getCurrentHappyHour();
    
    if (currentHappyHour) {
      const discount = currentHappyHour.discountPercent / 100;
      const discountedPrice = basePrice * (1 - discount);
      res.json({
        originalPrice: basePrice.toFixed(2),
        discountedPrice: discountedPrice.toFixed(2),
        happyHour: currentHappyHour,
        isHappyHour: true
      });
    } else {
      res.json({
        originalPrice: basePrice.toFixed(2),
        discountedPrice: basePrice.toFixed(2),
        happyHour: null,
        isHappyHour: false
      });
    }
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

    // Create default time packages
    const timePackagesData = [
      { name: "1 Hour", durationHours: 1, price: "5.00", isActive: true, sortOrder: 1 },
      { name: "2 Hours", durationHours: 2, price: "9.00", isActive: true, sortOrder: 2 },
      { name: "3 Hours", durationHours: 3, price: "12.00", isActive: true, sortOrder: 3 },
      { name: "5 Hours", durationHours: 5, price: "18.00", isActive: true, sortOrder: 4 },
      { name: "6 Hours", durationHours: 6, price: "20.00", isActive: true, sortOrder: 5 },
      { name: "7 Hours", durationHours: 7, price: "22.00", isActive: true, sortOrder: 6 },
      { name: "All Day (10 Hours)", durationHours: 10, price: "30.00", isActive: true, sortOrder: 7 },
    ];
    for (const pkg of timePackagesData) {
      await storage.createTimePackage(pkg);
    }

    await storage.createActivityLog({ type: "system", message: "System initialized with seed data" });

    res.json({ message: "Seed data created successfully" });
  });

  return httpServer;
}
