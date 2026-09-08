import type { Database, SqlJsStatic } from 'sql.js'
import schemaSql from './schema.sql?raw'
import seedSql from './seed.sql?raw'
import type { Asset, AuditLog, GraphEdge, GraphNode, SystemConfig, User, UserRole } from '@/types'

const DB_STORAGE_KEY = 'sd_ocean_bid_sqlite_v1'
const WASM_LOCAL = '/sql-wasm.wasm'
const WASM_CDN = 'https://sql.js.org/dist/sql-wasm.wasm'

let SQL: SqlJsStatic | null = null
let db: Database | null = null
let initPromise: Promise<Database> | null = null

type InitSqlJs = (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>

async function loadSqlJs(): Promise<SqlJsStatic> {
  const mod = await import('sql.js/dist/sql-wasm.js')
  const initSqlJs = ((mod as { default?: InitSqlJs }).default ??
    (mod as unknown as InitSqlJs)) as InitSqlJs
  if (typeof initSqlJs !== 'function') {
    throw new TypeError('sql.js init function not found in module export')
  }
  let lastError: unknown
  for (const locate of [WASM_LOCAL, WASM_CDN]) {
    try {
      return await initSqlJs({ locateFile: () => locate })
    } catch (e) {
      lastError = e
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Failed to init sql.js')
}

function persist() {
  if (!db) return
  const data = db.export()
  const arr = Array.from(data)
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr))
}

function runStatements(sql: string) {
  if (!db) throw new Error('Database not initialized')
  db.run(sql)
}

function queryAll<T>(sql: string, params: unknown[] = []): T[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare(sql)
  stmt.bind(params as never[])
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

function queryOne<T>(sql: string, params: unknown[] = []): T | null {
  const rows = queryAll<T>(sql, params)
  return rows[0] ?? null
}

export async function initDatabase(): Promise<Database> {
  if (db) return db
  if (initPromise) return initPromise

  initPromise = (async () => {
    SQL = await loadSqlJs()

    const saved = localStorage.getItem(DB_STORAGE_KEY)
    if (saved) {
      try {
        const data = new Uint8Array(JSON.parse(saved) as number[])
        db = new SQL.Database(data)
        return db
      } catch {
        localStorage.removeItem(DB_STORAGE_KEY)
      }
    }

    db = new SQL.Database()
    runStatements(schemaSql)
    runStatements(seedSql)
    persist()
    return db
  })()

  return initPromise
}

export function getDb(): Database {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')
  return db
}

export const dbService = {
  async login(username: string, password: string): Promise<User | null> {
    await initDatabase()
    const user = queryOne<User & { password_hash: string }>(
      'SELECT id, username, password_hash, role, email, created_at, last_login FROM t_users WHERE username = ?',
      [username],
    )
    if (!user || user.password_hash !== password) return null

    runStatements(`UPDATE t_users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}`)
    this.addAuditLog(user.id, 'LOGIN', `User ${username} logged in`, '127.0.0.1')
    persist()

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      created_at: user.created_at,
      last_login: user.last_login,
    }
  },

  getUserById(id: number): User | null {
    return queryOne<User>(
      'SELECT id, username, role, email, created_at, last_login FROM t_users WHERE id = ?',
      [id],
    )
  },

  listUsers(): User[] {
    return queryAll<User>('SELECT id, username, role, email, created_at, last_login FROM t_users ORDER BY id')
  },

  listAssets(opts: {
    keyword?: string
    category?: string
    onlyPublic?: boolean
    createdBy?: number
    page?: number
    pageSize?: number
  } = {}): { items: Asset[]; total: number } {
    const { keyword = '', category = '', onlyPublic = false, createdBy, page = 1, pageSize = 10 } = opts
    const where: string[] = ['1=1']
    const params: unknown[] = []

    if (keyword) {
      where.push('(title LIKE ? OR description LIKE ? OR inheritor LIKE ? OR region LIKE ?)')
      const like = `%${keyword}%`
      params.push(like, like, like, like)
    }
    if (category) {
      where.push('category = ?')
      params.push(category)
    }
    if (onlyPublic) {
      where.push('is_public = 1')
    }
    if (createdBy != null) {
      where.push('created_by = ?')
      params.push(createdBy)
    }

    const whereSql = where.join(' AND ')
    const totalRow = queryOne<{ c: number }>(`SELECT COUNT(*) as c FROM t_assets WHERE ${whereSql}`, params)
    const total = totalRow?.c ?? 0
    const offset = (page - 1) * pageSize
    const items = queryAll<Asset>(
      `SELECT * FROM t_assets WHERE ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset],
    )
    return { items, total }
  },

  getAsset(id: number): Asset | null {
    return queryOne<Asset>('SELECT * FROM t_assets WHERE id = ?', [id])
  },

  createAsset(payload: Omit<Asset, 'id' | 'created_at'>, userId: number): Asset {
    if (!db) throw new Error('Database not initialized')
    db.run(
      `INSERT INTO t_assets (title, category, region, inheritor, description, media_url, is_public, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.title,
        payload.category,
        payload.region,
        payload.inheritor,
        payload.description,
        payload.media_url,
        payload.is_public ? 1 : 0,
        userId,
      ],
    )
    this.addAuditLog(userId, 'CREATE_ASSET', `Created asset: ${payload.title}`, '127.0.0.1')
    persist()
    const row = queryOne<Asset>('SELECT * FROM t_assets ORDER BY id DESC LIMIT 1')
    if (!row) throw new Error('Failed to create asset')
    return row
  },

  updateAsset(id: number, payload: Partial<Asset>, userId: number): void {
    if (!db) throw new Error('Database not initialized')
    const fields: string[] = []
    const params: unknown[] = []
    if (payload.title != null) {
      fields.push('title = ?')
      params.push(payload.title)
    }
    if (payload.category != null) {
      fields.push('category = ?')
      params.push(payload.category)
    }
    if (payload.region != null) {
      fields.push('region = ?')
      params.push(payload.region)
    }
    if (payload.inheritor != null) {
      fields.push('inheritor = ?')
      params.push(payload.inheritor)
    }
    if (payload.description != null) {
      fields.push('description = ?')
      params.push(payload.description)
    }
    if (payload.media_url != null) {
      fields.push('media_url = ?')
      params.push(payload.media_url)
    }
    if (payload.is_public != null) {
      fields.push('is_public = ?')
      params.push(payload.is_public ? 1 : 0)
    }
    if (!fields.length) return
    params.push(id)
    db.run(`UPDATE t_assets SET ${fields.join(', ')} WHERE id = ?`, params as never[])
    this.addAuditLog(userId, 'UPDATE_ASSET', `Updated asset ID ${id}`, '127.0.0.1')
    persist()
  },

  deleteAsset(id: number, userId: number): void {
    if (!db) throw new Error('Database not initialized')
    db.run('DELETE FROM t_assets WHERE id = ?', [id])
    this.addAuditLog(userId, 'DELETE_ASSET', `Deleted asset ID ${id}`, '127.0.0.1')
    persist()
  },

  getGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: queryAll<GraphNode>('SELECT * FROM t_graph_nodes ORDER BY id'),
      edges: queryAll<GraphEdge>('SELECT * FROM t_graph_edges ORDER BY id'),
    }
  },

  listAuditLogs(limit = 50): AuditLog[] {
    return queryAll<AuditLog>(
      `SELECT l.*, u.username
       FROM t_audit_logs l
       LEFT JOIN t_users u ON u.id = l.user_id
       ORDER BY l.id DESC
       LIMIT ?`,
      [limit],
    )
  },

  addAuditLog(userId: number | null, action: string, details: string, ip: string): void {
    if (!db) throw new Error('Database not initialized')
    db.run('INSERT INTO t_audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)', [
      userId,
      action,
      details,
      ip,
    ])
    persist()
  },

  getConfigs(): SystemConfig[] {
    return queryAll<SystemConfig>('SELECT * FROM t_system_configs ORDER BY key')
  },

  getConfig(key: string): string | null {
    const row = queryOne<SystemConfig>('SELECT * FROM t_system_configs WHERE key = ?', [key])
    return row?.value ?? null
  },

  getStats() {
    const assets = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM t_assets')?.c ?? 0
    const publicAssets = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM t_assets WHERE is_public = 1')?.c ?? 0
    const nodes = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM t_graph_nodes')?.c ?? 0
    const edges = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM t_graph_edges')?.c ?? 0
    const users = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM t_users')?.c ?? 0
    const logs = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM t_audit_logs')?.c ?? 0
    const byCategory = queryAll<{ category: string; c: number }>(
      `SELECT COALESCE(category, '未分类') as category, COUNT(*) as c FROM t_assets GROUP BY category`,
    )
    return { assets, publicAssets, nodes, edges, users, logs, byCategory }
  },

  canEditAsset(role: UserRole, userId: number, asset: Asset): boolean {
    if (role === 'admin' || role === 'manager') return true
    if (role === 'operator') return asset.created_by === userId
    return false
  },

  resetDatabase(): void {
    localStorage.removeItem(DB_STORAGE_KEY)
    db = null
    initPromise = null
  },
}
