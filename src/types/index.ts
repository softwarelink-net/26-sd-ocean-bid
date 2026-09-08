export type UserRole = 'admin' | 'manager' | 'operator' | 'public'

export interface User {
  id: number
  username: string
  role: UserRole
  email: string | null
  created_at?: string
  last_login?: string | null
}

export interface Asset {
  id: number
  title: string
  category: string | null
  region: string | null
  inheritor: string | null
  description: string | null
  media_url: string | null
  is_public: number
  created_by: number | null
  created_at?: string
}

export interface GraphNode {
  id: number
  label: string
  type: string | null
  properties: string | null
  created_at?: string
}

export interface GraphEdge {
  id: number
  source_id: number
  target_id: number
  relation: string
  created_at?: string
}

export interface AuditLog {
  id: number
  user_id: number | null
  action: string
  details: string | null
  ip_address: string | null
  created_at?: string
  username?: string
}

export interface SystemConfig {
  key: string
  value: string
  description: string | null
  updated_at?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '超管/系统管理员',
  manager: '业务主管/编辑',
  operator: '基层经办/采集员',
  public: '决策层/公众用户',
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['users', 'roles', 'dictionary', 'security', 'assets', 'graph', 'dashboard', 'settings', 'audit'],
  manager: ['assets', 'approve', 'tags', 'experts', 'comments', 'graph', 'dashboard', 'stats'],
  operator: ['assets:own', 'upload', 'archive', 'relations', 'tickets', 'dashboard'],
  public: ['search', 'graph:read', 'map', 'subscribe', 'feedback', 'dashboard:read'],
}
