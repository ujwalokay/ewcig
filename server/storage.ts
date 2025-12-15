import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, sql } from "drizzle-orm";
import {
  users, members, terminals, games, storeItems, sessions, activityLogs, timePackages, happyHours, systemSettings, notifications,
  type User, type InsertUser,
  type Member, type InsertMember,
  type Terminal, type InsertTerminal,
  type Game, type InsertGame,
  type StoreItem, type InsertStoreItem,
  type Session, type InsertSession,
  type ActivityLog, type InsertActivityLog,
  type TimePackage, type InsertTimePackage,
  type HappyHour, type InsertHappyHour,
  type SystemSetting, type InsertSystemSetting,
  type Notification, type InsertNotification
} from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: string): Promise<boolean>;
  topUpMember(id: string, amount: string): Promise<Member | undefined>;
  
  getTerminals(): Promise<Terminal[]>;
  getTerminal(id: string): Promise<Terminal | undefined>;
  createTerminal(terminal: InsertTerminal): Promise<Terminal>;
  updateTerminal(id: string, terminal: Partial<InsertTerminal>): Promise<Terminal | undefined>;
  deleteTerminal(id: string): Promise<boolean>;
  
  getGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: string): Promise<boolean>;
  
  getStoreItems(): Promise<StoreItem[]>;
  getStoreItem(id: string): Promise<StoreItem | undefined>;
  createStoreItem(item: InsertStoreItem): Promise<StoreItem>;
  updateStoreItem(id: string, item: Partial<InsertStoreItem>): Promise<StoreItem | undefined>;
  deleteStoreItem(id: string): Promise<boolean>;
  
  getSessions(): Promise<Session[]>;
  getActiveSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  endSession(id: string, totalCost: string): Promise<Session | undefined>;
  
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  getTimePackages(): Promise<TimePackage[]>;
  getActiveTimePackages(): Promise<TimePackage[]>;
  getTimePackage(id: string): Promise<TimePackage | undefined>;
  createTimePackage(pkg: InsertTimePackage): Promise<TimePackage>;
  updateTimePackage(id: string, pkg: Partial<InsertTimePackage>): Promise<TimePackage | undefined>;
  deleteTimePackage(id: string): Promise<boolean>;
  
  getDashboardStats(): Promise<{
    activeSessions: number;
    totalTerminals: number;
    todayRevenue: string;
    topGames: { name: string; count: number; percent: number }[];
  }>;

  getHappyHours(): Promise<HappyHour[]>;
  getActiveHappyHours(): Promise<HappyHour[]>;
  getHappyHour(id: string): Promise<HappyHour | undefined>;
  createHappyHour(hh: InsertHappyHour): Promise<HappyHour>;
  updateHappyHour(id: string, hh: Partial<InsertHappyHour>): Promise<HappyHour | undefined>;
  deleteHappyHour(id: string): Promise<boolean>;
  getCurrentHappyHour(): Promise<HappyHour | undefined>;

  getSystemSettings(): Promise<SystemSetting[]>;
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  setSystemSetting(key: string, value: string, description?: string): Promise<SystemSetting>;
  deleteSystemSetting(key: string): Promise<boolean>;

  getNotifications(userId?: string): Promise<Notification[]>;
  getUnreadNotifications(userId?: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsRead(userId?: string): Promise<void>;
  deleteNotification(id: string): Promise<boolean>;

  searchMembers(query: string): Promise<Member[]>;
  deductMemberBalance(id: string, amount: string): Promise<Member | undefined>;

  getRevenueReport(startDate: Date, endDate: Date): Promise<{ date: string; revenue: string }[]>;
  getUsageReport(startDate: Date, endDate: Date): Promise<{ terminalId: string; terminalName: string; totalHours: number; sessions: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getMembers(): Promise<Member[]> {
    return db.select().from(members);
  }

  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values(member).returning();
    return newMember;
  }

  async updateMember(id: string, member: Partial<InsertMember>): Promise<Member | undefined> {
    const [updated] = await db.update(members).set(member).where(eq(members.id, id)).returning();
    return updated;
  }

  async deleteMember(id: string): Promise<boolean> {
    const result = await db.delete(members).where(eq(members.id, id));
    return true;
  }

  async topUpMember(id: string, amount: string): Promise<Member | undefined> {
    const [updated] = await db
      .update(members)
      .set({ balance: sql`${members.balance} + ${amount}::decimal` })
      .where(eq(members.id, id))
      .returning();
    return updated;
  }

  async getTerminals(): Promise<Terminal[]> {
    return db.select().from(terminals);
  }

  async getTerminal(id: string): Promise<Terminal | undefined> {
    const [terminal] = await db.select().from(terminals).where(eq(terminals.id, id));
    return terminal;
  }

  async createTerminal(terminal: InsertTerminal): Promise<Terminal> {
    const [newTerminal] = await db.insert(terminals).values(terminal).returning();
    return newTerminal;
  }

  async updateTerminal(id: string, terminal: Partial<InsertTerminal>): Promise<Terminal | undefined> {
    const [updated] = await db.update(terminals).set(terminal).where(eq(terminals.id, id)).returning();
    return updated;
  }

  async deleteTerminal(id: string): Promise<boolean> {
    await db.delete(terminals).where(eq(terminals.id, id));
    return true;
  }

  async getGames(): Promise<Game[]> {
    return db.select().from(games);
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async updateGame(id: string, game: Partial<InsertGame>): Promise<Game | undefined> {
    const [updated] = await db.update(games).set(game).where(eq(games.id, id)).returning();
    return updated;
  }

  async deleteGame(id: string): Promise<boolean> {
    await db.delete(games).where(eq(games.id, id));
    return true;
  }

  async getStoreItems(): Promise<StoreItem[]> {
    return db.select().from(storeItems);
  }

  async getStoreItem(id: string): Promise<StoreItem | undefined> {
    const [item] = await db.select().from(storeItems).where(eq(storeItems.id, id));
    return item;
  }

  async createStoreItem(item: InsertStoreItem): Promise<StoreItem> {
    const [newItem] = await db.insert(storeItems).values(item).returning();
    return newItem;
  }

  async updateStoreItem(id: string, item: Partial<InsertStoreItem>): Promise<StoreItem | undefined> {
    const [updated] = await db.update(storeItems).set(item).where(eq(storeItems.id, id)).returning();
    return updated;
  }

  async deleteStoreItem(id: string): Promise<boolean> {
    await db.delete(storeItems).where(eq(storeItems.id, id));
    return true;
  }

  async getSessions(): Promise<Session[]> {
    return db.select().from(sessions).orderBy(desc(sessions.startTime));
  }

  async getActiveSessions(): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.status, "active"));
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessions).values(session).returning();
    await db.update(terminals).set({ 
      status: "Occupied", 
      currentUserId: session.memberId 
    }).where(eq(terminals.id, session.terminalId));
    return newSession;
  }

  async endSession(id: string, totalCost: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (session) {
      await db.update(terminals).set({ 
        status: "Available", 
        currentUserId: null,
        currentGame: null
      }).where(eq(terminals.id, session.terminalId));
    }
    const [updated] = await db.update(sessions).set({ 
      status: "ended", 
      endTime: new Date(),
      totalCost 
    }).where(eq(sessions.id, id)).returning();
    return updated;
  }

  async getActivityLogs(limit = 20): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp)).limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getTimePackages(): Promise<TimePackage[]> {
    return db.select().from(timePackages).orderBy(timePackages.sortOrder);
  }

  async getActiveTimePackages(): Promise<TimePackage[]> {
    return db.select().from(timePackages).where(eq(timePackages.isActive, true)).orderBy(timePackages.sortOrder);
  }

  async getTimePackage(id: string): Promise<TimePackage | undefined> {
    const [pkg] = await db.select().from(timePackages).where(eq(timePackages.id, id));
    return pkg;
  }

  async createTimePackage(pkg: InsertTimePackage): Promise<TimePackage> {
    const [newPkg] = await db.insert(timePackages).values(pkg).returning();
    return newPkg;
  }

  async updateTimePackage(id: string, pkg: Partial<InsertTimePackage>): Promise<TimePackage | undefined> {
    const [updated] = await db.update(timePackages).set(pkg).where(eq(timePackages.id, id)).returning();
    return updated;
  }

  async deleteTimePackage(id: string): Promise<boolean> {
    await db.delete(timePackages).where(eq(timePackages.id, id));
    return true;
  }

  async getDashboardStats(): Promise<{
    activeSessions: number;
    totalTerminals: number;
    todayRevenue: string;
    topGames: { name: string; count: number; percent: number }[];
  }> {
    const activeSessions = await this.getActiveSessions();
    const allTerminals = await this.getTerminals();
    const allGames = await this.getGames();
    
    const gameCounts = allGames.map(g => ({
      name: g.name,
      count: g.activePlayerCount,
      percent: 0
    })).sort((a, b) => b.count - a.count).slice(0, 4);
    
    const total = gameCounts.reduce((sum, g) => sum + g.count, 0);
    gameCounts.forEach(g => {
      g.percent = total > 0 ? Math.round((g.count / total) * 100) : 0;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allSessions = await db.select().from(sessions).where(sql`DATE(${sessions.startTime}) = DATE(${today})`);
    const todayRevenue = allSessions.reduce((sum, s) => sum + parseFloat(s.totalCost || "0"), 0).toFixed(2);

    return {
      activeSessions: activeSessions.length,
      totalTerminals: allTerminals.length,
      todayRevenue,
      topGames: gameCounts
    };
  }

  async getHappyHours(): Promise<HappyHour[]> {
    return db.select().from(happyHours);
  }

  async getActiveHappyHours(): Promise<HappyHour[]> {
    return db.select().from(happyHours).where(eq(happyHours.isActive, true));
  }

  async getHappyHour(id: string): Promise<HappyHour | undefined> {
    const [hh] = await db.select().from(happyHours).where(eq(happyHours.id, id));
    return hh;
  }

  async createHappyHour(hh: InsertHappyHour): Promise<HappyHour> {
    const [newHH] = await db.insert(happyHours).values(hh).returning();
    return newHH;
  }

  async updateHappyHour(id: string, hh: Partial<InsertHappyHour>): Promise<HappyHour | undefined> {
    const [updated] = await db.update(happyHours).set(hh).where(eq(happyHours.id, id)).returning();
    return updated;
  }

  async deleteHappyHour(id: string): Promise<boolean> {
    await db.delete(happyHours).where(eq(happyHours.id, id));
    return true;
  }

  async getCurrentHappyHour(): Promise<HappyHour | undefined> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay().toString();
    
    const activeHours = await this.getActiveHappyHours();
    return activeHours.find(hh => {
      const days = hh.daysOfWeek.split(',');
      if (!days.includes(currentDay)) return false;
      return currentTime >= hh.startTime && currentTime <= hh.endTime;
    });
  }

  async getSystemSettings(): Promise<SystemSetting[]> {
    return db.select().from(systemSettings);
  }

  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting;
  }

  async setSystemSetting(key: string, value: string, description?: string): Promise<SystemSetting> {
    const existing = await this.getSystemSetting(key);
    if (existing) {
      const [updated] = await db.update(systemSettings).set({ value, description }).where(eq(systemSettings.key, key)).returning();
      return updated;
    }
    const [newSetting] = await db.insert(systemSettings).values({ key, value, description }).returning();
    return newSetting;
  }

  async deleteSystemSetting(key: string): Promise<boolean> {
    await db.delete(systemSettings).where(eq(systemSettings.key, key));
    return true;
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    if (userId) {
      return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
    }
    return db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotifications(userId?: string): Promise<Notification[]> {
    if (userId) {
      return db.select().from(notifications).where(sql`${notifications.userId} = ${userId} AND ${notifications.isRead} = false`).orderBy(desc(notifications.createdAt));
    }
    return db.select().from(notifications).where(eq(notifications.isRead, false)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotif] = await db.insert(notifications).values(notification).returning();
    return newNotif;
  }

  async markNotificationRead(id: string): Promise<Notification | undefined> {
    const [updated] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    return updated;
  }

  async markAllNotificationsRead(userId?: string): Promise<void> {
    if (userId) {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
    } else {
      await db.update(notifications).set({ isRead: true });
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    await db.delete(notifications).where(eq(notifications.id, id));
    return true;
  }

  async searchMembers(query: string): Promise<Member[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return db.select().from(members).where(
      sql`LOWER(${members.username}) LIKE ${lowerQuery} OR LOWER(${members.realName}) LIKE ${lowerQuery}`
    );
  }

  async deductMemberBalance(id: string, amount: string): Promise<Member | undefined> {
    const [updated] = await db.update(members).set({ 
      balance: sql`${members.balance} - ${amount}::decimal` 
    }).where(eq(members.id, id)).returning();
    return updated;
  }

  async getRevenueReport(startDate: Date, endDate: Date): Promise<{ date: string; revenue: string }[]> {
    const result = await db.select({
      date: sql<string>`DATE(${sessions.endTime})::text`,
      revenue: sql<string>`COALESCE(SUM(${sessions.totalCost}), 0)::text`
    }).from(sessions).where(
      sql`${sessions.endTime} >= ${startDate} AND ${sessions.endTime} <= ${endDate} AND ${sessions.status} = 'ended'`
    ).groupBy(sql`DATE(${sessions.endTime})`).orderBy(sql`DATE(${sessions.endTime})`);
    return result;
  }

  async getUsageReport(startDate: Date, endDate: Date): Promise<{ terminalId: string; terminalName: string; totalHours: number; sessions: number }[]> {
    const allTerminals = await this.getTerminals();
    const terminalSessions = await db.select({
      terminalId: sessions.terminalId,
      totalMinutes: sql<number>`COALESCE(SUM(${sessions.durationMinutes}), 0)`,
      sessionCount: sql<number>`COUNT(*)`
    }).from(sessions).where(
      sql`${sessions.startTime} >= ${startDate} AND ${sessions.startTime} <= ${endDate}`
    ).groupBy(sessions.terminalId);

    return allTerminals.map(t => {
      const stats = terminalSessions.find(s => s.terminalId === t.id);
      return {
        terminalId: t.id,
        terminalName: t.name,
        totalHours: stats ? Math.round(stats.totalMinutes / 60 * 10) / 10 : 0,
        sessions: stats ? stats.sessionCount : 0
      };
    });
  }
}

export const storage = new DatabaseStorage();
