import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const memberTierEnum = pgEnum("member_tier", ["Bronze", "Silver", "Gold", "Platinum"]);
export const terminalStatusEnum = pgEnum("terminal_status", ["Available", "Occupied", "Offline", "Maintenance"]);
export const sessionStatusEnum = pgEnum("session_status", ["active", "ended"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  realName: text("real_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  tier: memberTierEnum("tier").notNull().default("Bronze"),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  points: integer("points").notNull().default(0),
  avatarUrl: text("avatar_url"),
});

export const terminals = pgTable("terminals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  zone: text("zone").notNull().default("Main Floor"),
  status: terminalStatusEnum("status").notNull().default("Available"),
  currentUserId: varchar("current_user_id").references(() => members.id),
  currentGame: text("current_game"),
  ipAddress: text("ip_address"),
  specs: text("specs"),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  iconUrl: text("icon_url"),
  isPopular: boolean("is_popular").notNull().default(false),
  activePlayerCount: integer("active_player_count").notNull().default(0),
});

export const storeItems = pgTable("store_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id).notNull(),
  terminalId: varchar("terminal_id").references(() => terminals.id).notNull(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  status: sessionStatusEnum("status").notNull().default("active"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  durationMinutes: integer("duration_minutes"),
  timePackageId: varchar("time_package_id").references(() => timePackages.id),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  userId: varchar("user_id"),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const timePackages = pgTable("time_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  durationHours: integer("duration_hours").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const happyHours = pgTable("happy_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  discountPercent: integer("discount_percent").notNull().default(20),
  daysOfWeek: text("days_of_week").notNull().default("1,2,3,4,5"),
  isActive: boolean("is_active").notNull().default(true),
});

export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  userId: varchar("user_id"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({ id: true });
export const insertTerminalSchema = createInsertSchema(terminals).omit({ id: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertStoreItemSchema = createInsertSchema(storeItems).omit({ id: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true, startTime: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, timestamp: true });
export const insertTimePackageSchema = createInsertSchema(timePackages).omit({ id: true });
const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
const normalizeTime = (time: string) => {
  const trimmed = time.trim();
  const match = trimmed.match(timeRegex);
  if (!match) throw new Error(`Invalid time format: ${time}. Use HH:MM format.`);
  return `${match[1].padStart(2, '0')}:${match[2]}`;
};
export const insertHappyHourSchema = createInsertSchema(happyHours).omit({ id: true }).superRefine((data, ctx) => {
  if (!timeRegex.test(data.startTime.trim())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start time must be in HH:MM format", path: ["startTime"] });
  }
  if (!timeRegex.test(data.endTime.trim())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End time must be in HH:MM format", path: ["endTime"] });
  }
}).transform((data) => ({
  ...data,
  startTime: normalizeTime(data.startTime),
  endTime: normalizeTime(data.endTime)
}));
export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Launcher Content Tables
export const launcherGames = pgTable("launcher_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  iconType: text("icon_type").default("Gamepad2"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const launcherFoodItems = pgTable("launcher_food_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const launcherTournaments = pgTable("launcher_tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  game: text("game").notNull(),
  prizePool: text("prize_pool"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  description: text("description"),
  maxParticipants: integer("max_participants").default(32),
  currentParticipants: integer("current_participants").default(0),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const launcherRewards = pgTable("launcher_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  pointsCost: integer("points_cost").notNull(),
  imageUrl: text("image_url"),
  category: text("category").default("General"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const launcherApps = pgTable("launcher_apps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  iconType: text("icon_type").default("AppWindow"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertLauncherGameSchema = createInsertSchema(launcherGames).omit({ id: true });
export const insertLauncherFoodItemSchema = createInsertSchema(launcherFoodItems).omit({ id: true });
export const insertLauncherTournamentSchema = createInsertSchema(launcherTournaments).omit({ id: true });
export const insertLauncherRewardSchema = createInsertSchema(launcherRewards).omit({ id: true });
export const insertLauncherAppSchema = createInsertSchema(launcherApps).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type InsertTerminal = z.infer<typeof insertTerminalSchema>;
export type Terminal = typeof terminals.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertStoreItem = z.infer<typeof insertStoreItemSchema>;
export type StoreItem = typeof storeItems.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertTimePackage = z.infer<typeof insertTimePackageSchema>;
export type TimePackage = typeof timePackages.$inferSelect;
export type InsertHappyHour = z.infer<typeof insertHappyHourSchema>;
export type HappyHour = typeof happyHours.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertLauncherGame = z.infer<typeof insertLauncherGameSchema>;
export type LauncherGame = typeof launcherGames.$inferSelect;
export type InsertLauncherFoodItem = z.infer<typeof insertLauncherFoodItemSchema>;
export type LauncherFoodItem = typeof launcherFoodItems.$inferSelect;
export type InsertLauncherTournament = z.infer<typeof insertLauncherTournamentSchema>;
export type LauncherTournament = typeof launcherTournaments.$inferSelect;
export type InsertLauncherReward = z.infer<typeof insertLauncherRewardSchema>;
export type LauncherReward = typeof launcherRewards.$inferSelect;
export type InsertLauncherApp = z.infer<typeof insertLauncherAppSchema>;
export type LauncherApp = typeof launcherApps.$inferSelect;
