/** Placeholder mock API layer — all calls route to browser-side sql.js */
import { dbService } from '@/db/service'

export const api = {
  login: (username: string, password: string) => dbService.login(username, password),
  assets: (opts?: Parameters<typeof dbService.listAssets>[0]) => dbService.listAssets(opts),
  graph: () => dbService.getGraph(),
  stats: () => dbService.getStats(),
  configs: () => dbService.getConfigs(),
  auditLogs: (limit?: number) => dbService.listAuditLogs(limit),
}

export default api
