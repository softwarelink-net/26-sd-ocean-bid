-- Users Table
CREATE TABLE IF NOT EXISTS t_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'operator', 'public')),
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- System Configs
CREATE TABLE IF NOT EXISTS t_system_configs (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Non-Heritage Assets
CREATE TABLE IF NOT EXISTS t_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    region TEXT,
    inheritor TEXT,
    description TEXT,
    media_url TEXT,
    is_public BOOLEAN DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES t_users(id)
);

-- Knowledge Graph Nodes
CREATE TABLE IF NOT EXISTS t_graph_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    type TEXT,
    properties TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Graph Edges
CREATE TABLE IF NOT EXISTS t_graph_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    target_id INTEGER,
    relation TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES t_graph_nodes(id),
    FOREIGN KEY (target_id) REFERENCES t_graph_nodes(id)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS t_audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES t_users(id)
);
