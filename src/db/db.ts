import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database setup
const dbPath = path.join(__dirname, 'databases', 'app.db');
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}
const db = new Database(dbPath);

// Types
export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'coach' | 'player';
}

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  const users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'coach', password: 'password', role: 'coach' },
    { username: 'player', password: 'password', role: 'player' }
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)');
  
  //seeding the database with initial users
  for (const user of users) {
    stmt.run(user.username, user.password, user.role);
  }
  
  console.log('Database initialized with seed users');
}

export function findUserByUsername(username: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as User | undefined;
}

export default db;
