import fs from 'fs';
import path from 'path';

export interface Ingredient {
  name: string;
  status: 'safe' | 'moderate' | 'risky';
  reason: string;
}

export interface Scan {
  id: string;
  productName: string;
  brand: string;
  image: string;
  safetyScore: number;
  isSafe: boolean;
  timestamp: string;
  ingredients: Ingredient[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  allergies?: string[];
  dietGoals?: string[];
  avoidIngredients?: string[];
  createdAt: string;
  scans: Scan[];
}

interface Database {
  users: Record<string, User>;
}

const DB_PATH = path.join(process.cwd(), 'lib', 'db', 'users.json');

// Read database
export function readDatabase(): Database {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: {} };
  }
}

// Write database
function writeDatabase(data: Database): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Get user by ID
export function getUserById(userId: string): User | null {
  const db = readDatabase();
  return db.users[userId] || null;
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  const db = readDatabase();
  return Object.values(db.users).find(user => user.email === email) || null;
}

// Create or update user
export function upsertUser(userData: Partial<User> & { id: string; email: string }): User {
  const db = readDatabase();
  
  const existingUser = db.users[userData.id];
  
  const user: User = {
    ...existingUser,
    ...userData,
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    scans: existingUser?.scans || [],
  } as User;
  
  db.users[userData.id] = user;
  writeDatabase(db);
  
  return user;
}

// Add scan to user
export function addScanToUser(userId: string, scan: Scan): User | null {
  const db = readDatabase();
  const user = db.users[userId];
  
  if (!user) {
    return null;
  }
  
  // Add scan to the beginning of the array (most recent first)
  user.scans.unshift(scan);
  
  db.users[userId] = user;
  writeDatabase(db);
  
  return user;
}

// Get user scans
export function getUserScans(userId: string, limit?: number): Scan[] {
  const user = getUserById(userId);
  if (!user) return [];
  
  return limit ? user.scans.slice(0, limit) : user.scans;
}

// Update user preferences
export function updateUserPreferences(
  userId: string,
  preferences: {
    allergies?: string[];
    dietGoals?: string[];
    avoidIngredients?: string[];
  }
): User | null {
  const db = readDatabase();
  const user = db.users[userId];
  
  if (!user) {
    return null;
  }
  
  user.allergies = preferences.allergies ?? user.allergies;
  user.dietGoals = preferences.dietGoals ?? user.dietGoals;
  user.avoidIngredients = preferences.avoidIngredients ?? user.avoidIngredients;
  
  db.users[userId] = user;
  writeDatabase(db);
  
  return user;
}

// Get user stats
export function getUserStats(userId: string) {
  const user = getUserById(userId);
  if (!user) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayScans = user.scans.filter(scan => {
    const scanDate = new Date(scan.timestamp);
    return scanDate >= today;
  });
  
  const safeCount = todayScans.filter(scan => scan.isSafe).length;
  const riskyCount = todayScans.filter(scan => !scan.isSafe).length;
  
  return {
    totalScans: user.scans.length,
    todayScans: todayScans.length,
    safeToday: safeCount,
    riskyToday: riskyCount,
    averageScore: user.scans.length > 0
      ? Math.round(user.scans.reduce((sum, scan) => sum + scan.safetyScore, 0) / user.scans.length)
      : 0,
  };
}

