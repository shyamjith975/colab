/**
 * co-lab SQLite Database Access Layer
 *
 * Direct low-latency connection to colab.db using Node.js DatabaseSync.
 * Supports relational column lookups, structured filtering, full-fidelity JSON deserialization,
 * and live transaction execution.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'colab.db');

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Database file not found at ${dbPath}. Please run "npm run init-db" first.`);
    }
    dbInstance = new DatabaseSync(dbPath);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

/**
 * Fetch all records from a table, parsed back into full object structures.
 */
export function getAll(table, options = {}) {
  const db = getDatabase();
  let sql = `SELECT raw FROM ${table}`;
  const params = [];

  if (options.where && Object.keys(options.where).length > 0) {
    const conditions = [];
    for (const [key, val] of Object.entries(options.where)) {
      conditions.push(`${key} = ?`);
      params.push(val);
    }
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy} ${options.order || 'ASC'}`;
  }

  if (options.limit) {
    sql += ` LIMIT ${Number(options.limit)}`;
  }

  const rows = db.prepare(sql).all(...params);
  return rows.map(r => JSON.parse(r.raw));
}

/**
 * Fetch single record by ID
 */
export function getById(table, id) {
  const db = getDatabase();
  const row = db.prepare(`SELECT raw FROM ${table} WHERE id = ?`).get(id);
  return row ? JSON.parse(row.raw) : null;
}

/**
 * Insert or replace a record in a table
 */
export function insertRecord(table, record, standardMapping = {}) {
  const db = getDatabase();
  const raw = JSON.stringify(record);
  const cols = ['id', 'raw', ...Object.keys(standardMapping)];
  const placeholders = cols.map(() => '?').join(', ');
  const values = [record.id, raw, ...Object.values(standardMapping)].map(v => v === undefined ? null : v);

  const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`);
  stmt.run(...values);
  return record;
}

/**
 * Update an existing record by merging updates into its raw JSON
 */
export function updateRecord(table, id, updates) {
  const existing = getById(table, id);
  if (!existing) {
    throw new Error(`Record with id ${id} not found in ${table}`);
  }
  const merged = { ...existing, ...updates };
  insertRecord(table, merged);
  return merged;
}

/**
 * Delete a record by ID
 */
export function deleteRecord(table, id) {
  const db = getDatabase();
  const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
  const res = stmt.run(id);
  return { success: true, changes: res.changes };
}

/**
 * Execute custom SQL query (read-only for security)
 */
export function executeRawQuery(sql, params = []) {
  const db = getDatabase();
  const trimmed = sql.trim();
  const isSelect = /^SELECT\b/i.test(trimmed) || /^PRAGMA\b/i.test(trimmed);

  if (!isSelect) {
    throw new Error('Only SELECT or PRAGMA queries are allowed via the raw query endpoint.');
  }

  return db.prepare(sql).all(...params);
}

/**
 * Get table row counts and schema information
 */
export function getDatabaseStats() {
  const db = getDatabase();
  const tables = [
    'users', 'creators', 'businesses', 'campaigns', 'campaign_applications',
    'collaborations', 'sponsorships', 'sponsor_rfps', 'creative_professionals',
    'ad_inventory', 'reviews', 'transactions', 'local_ad_channels', 'creator_collectives',
    'affiliate_programs', 'creator_affiliate_links', 'booking_slots', 'structured_enquiries',
    'negotiation_quotes', 'performance_attributions', 'conversations', 'messages', 'settings'
  ];

  const stats = {};
  for (const t of tables) {
    try {
      const row = db.prepare(`SELECT COUNT(*) as count FROM ${t}`).get();
      stats[t] = row.count;
    } catch {
      stats[t] = 0;
    }
  }

  const fileSize = fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0;

  return {
    database: 'colab.db',
    path: dbPath,
    fileSizeBytes: fileSize,
    fileSizeFormatted: `${(fileSize / 1024).toFixed(1)} KB`,
    tables: stats,
    connected: true,
    lastChecked: new Date().toISOString()
  };
}

