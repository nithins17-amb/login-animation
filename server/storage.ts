import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // OTP methods
  setOTP(contact: string, otp: string): Promise<void>;
  getOTP(contact: string): Promise<string | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private otps: Map<string, string>;

  constructor() {
    this.users = new Map();
    this.otps = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      fullName: insertUser.fullName ?? null,
      email: insertUser.email ?? null,
      phoneNumber: insertUser.phoneNumber ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async setOTP(contact: string, otp: string): Promise<void> {
    this.otps.set(contact, otp);
  }

  async getOTP(contact: string): Promise<string | undefined> {
    return this.otps.get(contact);
  }
}

export const storage = new MemStorage();
