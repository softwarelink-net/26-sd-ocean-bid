INSERT INTO t_users (username, password_hash, role, email) VALUES
('admin', 'admin123', 'admin', 'admin@sd-union.gov.cn'),
('manager', 'manager123', 'manager', 'manager@sd-union.gov.cn'),
('operator', 'operator123', 'operator', 'operator@sd-union.gov.cn'),
('public', 'public123', 'public', 'visitor@example.com');

INSERT INTO t_system_configs (key, value, description) VALUES
('site_name', '华侨非物质文化遗产数字管理系统', 'System Title'),
('security_level', 'Level-3', 'Equal Protection Level'),
('encryption', 'SM4', 'Encryption Algorithm'),
('backup_status', 'healthy', 'Last backup status'),
('ml_filter', 'enabled', 'Sensitive word filter');

INSERT INTO t_assets (title, category, region, inheritor, description, media_url, is_public, created_by) VALUES
('胶东剪纸', 'Craft', '山东·青岛', '张三', '胶东半岛传统剪纸艺术，纹样丰富，寓意吉祥，在海外侨胞社群中广泛传承。', '/assets/media/paper-cut.svg', 1, 3),
('吕剧唱腔', 'Performance', '山东·济南', '李四', '山东地方戏曲代表剧种，唱腔婉转，情感细腻，是侨乡文化传播的重要载体。', '/assets/media/lvju.svg', 1, 3),
('泰山刻石', 'Artifact', '山东·泰安', '历史遗存', '泰山历代碑刻与摩崖石刻，记录中华文明与海外文化交流印记。', '/assets/media/taishan.svg', 1, 1),
('海外舞狮', 'Performance', '东南亚侨社', '陈建国', '华人华侨社区传统节庆表演，融合南狮与北狮技艺，延续侨乡文化认同。', '/assets/media/lion-dance.svg', 1, 3),
('潮汕工夫茶', 'Ritual', '广东·潮汕 / 海外潮籍', '王美华', '工夫茶礼仪与器具体系，在东南亚与北美潮籍侨团中完整保留。', '/assets/media/tea.svg', 1, 3),
('客家山歌', 'Performance', '闽粤赣 / 海外客家', '黄永福', '客家山歌在侨居地的变体与传唱，承载迁徙记忆与乡愁叙事。', NULL, 1, 2);

INSERT INTO t_graph_nodes (label, type, properties) VALUES
('张三', 'Person', '{"age": 65, "location": "青岛", "role": "代表性传承人"}'),
('胶东剪纸', 'Artwork', '{"difficulty": "High", "materials": "红纸", "category": "Craft"}'),
('青岛', 'Location', '{"region": "胶东", "type": "城市"}'),
('李四', 'Person', '{"age": 58, "location": "济南", "role": "吕剧传人"}'),
('吕剧唱腔', 'Artwork', '{"genre": "地方戏曲", "province": "山东"}'),
('陈建国', 'Person', '{"age": 47, "location": "新加坡", "role": "侨社文艺骨干"}'),
('海外舞狮', 'Artwork', '{"style": "南狮", "festivals": "春节/中秋"}'),
('东南亚侨社', 'Location', '{"countries": "新加坡,马来西亚,印尼"}'),
('王美华', 'Person', '{"age": 52, "location": "曼谷", "role": "潮籍茶艺师"}'),
('潮汕工夫茶', 'Artwork', '{"ritual": "工夫茶", "tools": "盖碗、紫砂"}');

INSERT INTO t_graph_edges (source_id, target_id, relation) VALUES
(1, 2, 'creator_of'),
(2, 3, 'originated_in'),
(4, 5, 'inherits'),
(6, 7, 'creator_of'),
(7, 8, 'practiced_in'),
(9, 10, 'inherits'),
(1, 6, 'mentored'),
(3, 8, 'diaspora_link');

INSERT INTO t_audit_logs (user_id, action, details, ip_address) VALUES
(1, 'LOGIN', 'Admin login success', '192.168.1.100'),
(3, 'CREATE_ASSET', 'Created asset: 胶东剪纸', '192.168.1.105'),
(2, 'APPROVE_ASSET', 'Approved asset ID 2', '192.168.1.88'),
(1, 'UPDATE_CONFIG', 'Updated encryption=SM4', '192.168.1.100'),
(3, 'UPLOAD_MEDIA', 'Uploaded paper-cut media', '192.168.1.105');
