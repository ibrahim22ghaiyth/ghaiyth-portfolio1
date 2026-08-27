-- SentinelDesk — full schema + seed data
-- Auto-generated from the working database. Rebuild via init_db.py
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS company_profile;
CREATE TABLE company_profile (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  company_name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  headquarters TEXT NOT NULL,
  website TEXT NOT NULL,
  portal_name TEXT NOT NULL,
  portal_year TEXT NOT NULL,
  source_note TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL,
  team TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS service_catalog;
CREATE TABLE service_catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_key TEXT NOT NULL UNIQUE,
  service_name TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  portal_usage TEXT NOT NULL,
  source_url TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS protected_assets;
CREATE TABLE protected_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id TEXT NOT NULL UNIQUE,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  service_key TEXT NOT NULL,
  environment TEXT NOT NULL,
  region TEXT NOT NULL,
  risk_score INTEGER DEFAULT 0,
  protection_status TEXT DEFAULT 'monitored',
  last_review TEXT,
  owner_team TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(service_key) REFERENCES service_catalog(service_key) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS security_events;
CREATE TABLE security_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  event_date TEXT NOT NULL,
  severity TEXT NOT NULL,
  event_type TEXT NOT NULL,
  service_key TEXT NOT NULL,
  asset_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  analyst TEXT,
  mitigation TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(service_key) REFERENCES service_catalog(service_key) ON DELETE RESTRICT,
  FOREIGN KEY(asset_id) REFERENCES protected_assets(asset_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS incidents;
CREATE TABLE incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_no TEXT NOT NULL UNIQUE,
  opened_at TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  affected_service TEXT NOT NULL,
  status TEXT DEFAULT 'triage',
  owner TEXT,
  sla_target TEXT,
  root_cause TEXT,
  resolution TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS vulnerability_advisories;
CREATE TABLE vulnerability_advisories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advisory_id TEXT NOT NULL UNIQUE,
  cve TEXT,
  published_date TEXT,
  severity TEXT,
  product_area TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT DEFAULT 'watching',
  source_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS support_cases;
CREATE TABLE support_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_no TEXT NOT NULL UNIQUE,
  opened_at TEXT NOT NULL,
  priority TEXT NOT NULL,
  requester TEXT NOT NULL,
  subject TEXT NOT NULL,
  related_service TEXT,
  status TEXT DEFAULT 'open',
  assigned_to TEXT,
  next_update TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS compliance_reports;
CREATE TABLE compliance_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_no TEXT NOT NULL UNIQUE,
  report_name TEXT NOT NULL,
  framework TEXT NOT NULL,
  period TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  owner TEXT,
  evidence_count INTEGER DEFAULT 0,
  generated_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS zero_trust_policies;
CREATE TABLE zero_trust_policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  policy_id TEXT NOT NULL UNIQUE,
  policy_name TEXT NOT NULL,
  application TEXT NOT NULL,
  decision TEXT NOT NULL,
  identity_provider TEXT,
  device_posture TEXT,
  status TEXT DEFAULT 'enabled',
  last_changed TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS api_inventory;
CREATE TABLE api_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_id TEXT NOT NULL UNIQUE,
  api_name TEXT NOT NULL,
  endpoint_pattern TEXT NOT NULL,
  auth_type TEXT,
  exposure TEXT,
  traffic_24h INTEGER DEFAULT 0,
  risk_level TEXT,
  protection TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS client_reports;
CREATE TABLE client_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL,
  audience TEXT NOT NULL,
  period TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT DEFAULT 'ready',
  owner TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS activity_log;
CREATE TABLE activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  record_ref TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- data: company_profile (1 rows)
INSERT INTO company_profile (id,company_name,legal_name,industry,headquarters,website,portal_name,portal_year,source_note,updated_at) VALUES (1,'Cloudflare','Cloudflare, Inc.','Cybersecurity, connectivity cloud, application security, network security, and Zero Trust services','San Francisco, California, United States','https://www.cloudflare.com/','SentinelDesk Client Portal','2024','Built from publicly available Cloudflare product/service information; this portfolio build is not an official Cloudflare product or affiliation.','2026-06-12 03:03:06');

-- data: users (3 rows)
INSERT INTO users (id,full_name,username,email,password_hash,salt,role,team,active,created_at) VALUES (1,'Ibrahim Ghaiyth','admin','ibrahim.security@sentineldesk.local','9ef3f507fbea5acd80abaac8b32f4f335669ead2bba7885b71f817d12e62e6eb','sentineldesk-cloudflare-2024','Portal Architect','Security Engineering',1,'2026-06-12 03:03:06');
INSERT INTO users (id,full_name,username,email,password_hash,salt,role,team,active,created_at) VALUES (2,'SOC Lead','soc.lead','soc.lead@sentineldesk.local','9ef3f507fbea5acd80abaac8b32f4f335669ead2bba7885b71f817d12e62e6eb','sentineldesk-cloudflare-2024','SOC Lead','Managed Detection',1,'2026-06-12 03:03:06');
INSERT INTO users (id,full_name,username,email,password_hash,salt,role,team,active,created_at) VALUES (3,'Client Success Analyst','client.success','client.success@sentineldesk.local','9ef3f507fbea5acd80abaac8b32f4f335669ead2bba7885b71f817d12e62e6eb','sentineldesk-cloudflare-2024','Client Success','Customer Security',1,'2026-06-12 03:03:06');

-- data: service_catalog (7 rows)
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (1,'waf','Cloudflare WAF','Application Security','Edge-based web application firewall for protecting applications without sacrificing performance.','Shows managed rules, blocked requests, exposed endpoints, and application risk posture.','https://www.cloudflare.com/products/waf/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (2,'ddos','DDoS Protection','Application / Network Security','Cloudflare application services help block DDoS attacks and bad bots while protecting applications and APIs.','Summarizes volumetric events, mitigation windows, attack classes, and SLA response.','https://www.cloudflare.com/application-services/products/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (3,'magic_transit','Magic Transit','Network Security','Hardware-free Layer 3/4 DDoS protection using Cloudflare''s global network.','Tracks protected prefixes, scrubbing state, attack absorption, and network risk.','https://www.cloudflare.com/products/magic-transit/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (4,'zero_trust','Cloudflare One / Zero Trust','SASE / Zero Trust','Zero Trust access and network modernization capabilities across users, apps, and networks.','Displays access policies, device posture, identity decisions, and sensitive app exposure.','https://www.cloudflare.com/zero-trust/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (5,'api_shield','API Shield','API Security','API protection controls for managing and protecting API traffic.','Maps API inventory, auth posture, schema/rate risk, and abuse signals.','https://www.cloudflare.com/application-services/products/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (6,'bot_management','Bot Management','Application Security','Controls for identifying and reducing unwanted automated traffic.','Tracks automation, bot score bands, blocked sessions, and business-impact exceptions.','https://www.cloudflare.com/solutions/security/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO service_catalog (id,service_key,service_name,category,summary,portal_usage,source_url,status,created_at,updated_at) VALUES (7,'turnstile','Turnstile','Bot / Abuse Protection','Privacy-preserving CAPTCHA replacement that confirms visitors are real without visual puzzles.','Shows challenge-free verification coverage and bot friction reduction.','https://www.cloudflare.com/products/turnstile/','active','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: protected_assets (6 rows)
INSERT INTO protected_assets (id,asset_id,asset_name,asset_type,service_key,environment,region,risk_score,protection_status,last_review,owner_team,notes,created_at,updated_at) VALUES (1,'AST-CF-WAF-001','Public Web Applications','Application Zone','waf','production','Global Edge',28,'protected','2024-12-10','Application Security','WAF and managed rules enabled.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO protected_assets (id,asset_id,asset_name,asset_type,service_key,environment,region,risk_score,protection_status,last_review,owner_team,notes,created_at,updated_at) VALUES (2,'AST-CF-API-001','Public API Surface','API Gateway','api_shield','production','Global Edge',36,'monitored','2024-12-12','API Security','Schema coverage and auth review active.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO protected_assets (id,asset_id,asset_name,asset_type,service_key,environment,region,risk_score,protection_status,last_review,owner_team,notes,created_at,updated_at) VALUES (3,'AST-CF-NET-001','Network Prefix Protection','Network Prefix','magic_transit','production','Global Edge',18,'protected','2024-12-09','Network Security','Transit DDoS posture mapped.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO protected_assets (id,asset_id,asset_name,asset_type,service_key,environment,region,risk_score,protection_status,last_review,owner_team,notes,created_at,updated_at) VALUES (4,'AST-CF-ZT-001','Internal Admin Apps','Private Application','zero_trust','production','US / EU',22,'protected','2024-12-08','Zero Trust','Identity-aware policy coverage.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO protected_assets (id,asset_id,asset_name,asset_type,service_key,environment,region,risk_score,protection_status,last_review,owner_team,notes,created_at,updated_at) VALUES (5,'AST-CF-BOT-001','Login and Checkout Paths','Business-Critical Path','bot_management','production','Global Edge',41,'attention','2024-12-11','Application Security','Automation monitoring and allowlist review required.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO protected_assets (id,asset_id,asset_name,asset_type,service_key,environment,region,risk_score,protection_status,last_review,owner_team,notes,created_at,updated_at) VALUES (6,'AST-CF-TURN-001','Account Signup Flow','User Verification','turnstile','production','Global Edge',16,'protected','2024-12-07','Trust & Safety','Turnstile challenge-free verification active.','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: security_events (5 rows)
INSERT INTO security_events (id,event_id,event_date,severity,event_type,service_key,asset_id,title,description,status,analyst,mitigation,created_at,updated_at) VALUES (1,'EVT-2024-1201','2024-12-01','high','HTTP DDoS','ddos','AST-CF-WAF-001','Layer 7 surge on public web applications','Abnormal request-rate burst was mitigated by edge controls.','closed','SOC Lead','Rate rules and managed challenge policies reviewed.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO security_events (id,event_id,event_date,severity,event_type,service_key,asset_id,title,description,status,analyst,mitigation,created_at,updated_at) VALUES (2,'EVT-2024-1204','2024-12-04','medium','Bot Automation','bot_management','AST-CF-BOT-001','Credential stuffing pattern detected','Multiple automated login attempts were grouped by bot behavior and risk score.','investigating','Client Success Analyst','Recommended MFA enforcement and bot score threshold tuning.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO security_events (id,event_id,event_date,severity,event_type,service_key,asset_id,title,description,status,analyst,mitigation,created_at,updated_at) VALUES (3,'EVT-2024-1207','2024-12-07','critical','API Abuse','api_shield','AST-CF-API-001','Unauthenticated API burst','Traffic spike on wildcard endpoint pattern with missing client signature.','open','SOC Lead','Apply stricter auth requirement and endpoint rate controls.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO security_events (id,event_id,event_date,severity,event_type,service_key,asset_id,title,description,status,analyst,mitigation,created_at,updated_at) VALUES (4,'EVT-2024-1210','2024-12-10','low','Zero Trust Access','zero_trust','AST-CF-ZT-001','Policy exception review','Admin application policy has temporary contractor group exception.','review','Ibrahim Ghaiyth','Expire exception and document owner approval.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO security_events (id,event_id,event_date,severity,event_type,service_key,asset_id,title,description,status,analyst,mitigation,created_at,updated_at) VALUES (5,'EVT-2024-1211','2024-12-11','medium','Network DDoS','magic_transit','AST-CF-NET-001','UDP amplification attempt','Short burst of reflected UDP traffic was absorbed at network edge.','closed','SOC Lead','No origin impact observed.','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: incidents (3 rows)
INSERT INTO incidents (id,incident_no,opened_at,severity,title,affected_service,status,owner,sla_target,root_cause,resolution,created_at,updated_at) VALUES (1,'INC-2024-001','2024-12-01 09:14','high','Public application HTTP flood','Cloudflare WAF / DDoS','resolved','SOC Lead','2h','Burst automation against public edge endpoint.','Managed challenge plus rate-based rule update.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO incidents (id,incident_no,opened_at,severity,title,affected_service,status,owner,sla_target,root_cause,resolution,created_at,updated_at) VALUES (2,'INC-2024-002','2024-12-04 16:40','medium','Login automation cluster','Bot Management','investigating','Client Success Analyst','6h','','Credential stuffing recommendations prepared.','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO incidents (id,incident_no,opened_at,severity,title,affected_service,status,owner,sla_target,root_cause,resolution,created_at,updated_at) VALUES (3,'INC-2024-003','2024-12-07 11:22','critical','API authentication anomaly','API Shield','triage','SOC Lead','1h','','Endpoint authentication review in progress.','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: vulnerability_advisories (4 rows)
INSERT INTO vulnerability_advisories (id,advisory_id,cve,published_date,severity,product_area,title,summary,status,source_url,created_at,updated_at) VALUES (1,'ADV-2024-XZ-3094','CVE-2024-3094','2024-03-29','critical','Linux supply chain','xz Utils backdoor watch','Supply-chain compromise in xz Utils triggered emergency review of Linux build/deploy exposure.','resolved','https://www.cisa.gov/news-events/alerts/2024/03/29/reported-supply-chain-compromise-affecting-xz-utils-data-compression-library-cve-2024-3094','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO vulnerability_advisories (id,advisory_id,cve,published_date,severity,product_area,title,summary,status,source_url,created_at,updated_at) VALUES (2,'ADV-2024-PAN-3400','CVE-2024-3400','2024-04-12','critical','Firewall / edge security','PAN-OS command injection watch','Critical network edge vulnerability used for perimeter exposure review and emergency patch tracking.','watching','https://nvd.nist.gov/vuln/detail/CVE-2024-3400','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO vulnerability_advisories (id,advisory_id,cve,published_date,severity,product_area,title,summary,status,source_url,created_at,updated_at) VALUES (3,'ADV-2024-REGRESSHION-6387','CVE-2024-6387','2024-07-01','high','OpenSSH','regreSSHion exposure review','OpenSSH server vulnerability watch item for remote access posture and internet-exposed service review.','watching','https://nvd.nist.gov/vuln/detail/CVE-2024-6387','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO vulnerability_advisories (id,advisory_id,cve,published_date,severity,product_area,title,summary,status,source_url,created_at,updated_at) VALUES (4,'ADV-2024-IVANTI-21887','CVE-2024-21887','2024-01-10','critical','VPN / secure access','Ivanti gateway exposure watch','Secure access gateway exploit watch for customer perimeter inventory correlation.','review','https://nvd.nist.gov/vuln/detail/CVE-2024-21887','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: support_cases (4 rows)
INSERT INTO support_cases (id,case_no,opened_at,priority,requester,subject,related_service,status,assigned_to,next_update,created_at,updated_at) VALUES (1,'CASE-2024-1001','2024-12-02','P1','Security Operations','Emergency L7 DDoS report request','DDoS Protection','closed','SOC Lead','2024-12-02 13:00','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO support_cases (id,case_no,opened_at,priority,requester,subject,related_service,status,assigned_to,next_update,created_at,updated_at) VALUES (2,'CASE-2024-1002','2024-12-04','P2','Trust & Safety','Bot traffic tuning review','Bot Management','open','Client Success Analyst','2024-12-05 10:00','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO support_cases (id,case_no,opened_at,priority,requester,subject,related_service,status,assigned_to,next_update,created_at,updated_at) VALUES (3,'CASE-2024-1003','2024-12-07','P1','API Security','API Shield authentication gap review','API Shield','open','SOC Lead','2024-12-07 14:00','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO support_cases (id,case_no,opened_at,priority,requester,subject,related_service,status,assigned_to,next_update,created_at,updated_at) VALUES (4,'CASE-2024-1004','2024-12-10','P3','Compliance Team','Monthly security posture export','Reporting','ready','Ibrahim Ghaiyth','2024-12-12 09:00','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: compliance_reports (4 rows)
INSERT INTO compliance_reports (id,report_no,report_name,framework,period,score,status,owner,evidence_count,generated_at,created_at,updated_at) VALUES (1,'RPT-2024-DEC-WAF','December WAF Posture Report','Application Security','2024-12',91,'ready','Application Security',42,'2024-12-12','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO compliance_reports (id,report_no,report_name,framework,period,score,status,owner,evidence_count,generated_at,created_at,updated_at) VALUES (2,'RPT-2024-DEC-ZT','Zero Trust Access Review','Zero Trust','2024-12',86,'ready','Zero Trust',28,'2024-12-11','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO compliance_reports (id,report_no,report_name,framework,period,score,status,owner,evidence_count,generated_at,created_at,updated_at) VALUES (3,'RPT-2024-Q4-API','Q4 API Exposure Review','API Security','2024-Q4',79,'draft','API Security',34,'2024-12-10','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO compliance_reports (id,report_no,report_name,framework,period,score,status,owner,evidence_count,generated_at,created_at,updated_at) VALUES (4,'RPT-2024-Q4-COMPLIANCE','Q4 Security Control Evidence','SOC 2 / ISO Evidence','2024-Q4',88,'review','Compliance',73,'2024-12-09','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: zero_trust_policies (4 rows)
INSERT INTO zero_trust_policies (id,policy_id,policy_name,application,decision,identity_provider,device_posture,status,last_changed,created_at,updated_at) VALUES (1,'ZT-APP-001','Require identity for admin apps','Admin Console','allow','SAML / OIDC','Managed device required','enabled','2024-12-08','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO zero_trust_policies (id,policy_id,policy_name,application,decision,identity_provider,device_posture,status,last_changed,created_at,updated_at) VALUES (2,'ZT-APP-002','Contractor exception policy','Vendor Portal','allow','SAML / OIDC','Temporary exception','review','2024-12-10','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO zero_trust_policies (id,policy_id,policy_name,application,decision,identity_provider,device_posture,status,last_changed,created_at,updated_at) VALUES (3,'ZT-APP-003','Block unmanaged devices','Finance Workspace','block','SAML / OIDC','Corporate device only','enabled','2024-12-05','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO zero_trust_policies (id,policy_id,policy_name,application,decision,identity_provider,device_posture,status,last_changed,created_at,updated_at) VALUES (4,'ZT-APP-004','Service token access','CI Pipeline','allow','Service Token','Workload identity','enabled','2024-12-06','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: api_inventory (4 rows)
INSERT INTO api_inventory (id,api_id,api_name,endpoint_pattern,auth_type,exposure,traffic_24h,risk_level,protection,status,created_at,updated_at) VALUES (1,'API-001','Public Account API','/v1/accounts/*','OAuth2','public',482000,'medium','API Shield + rate rules','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO api_inventory (id,api_id,api_name,endpoint_pattern,auth_type,exposure,traffic_24h,risk_level,protection,status,created_at,updated_at) VALUES (2,'API-002','Billing Webhook','/webhooks/billing/*','HMAC signature','partner',32000,'low','Schema validation','active','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO api_inventory (id,api_id,api_name,endpoint_pattern,auth_type,exposure,traffic_24h,risk_level,protection,status,created_at,updated_at) VALUES (3,'API-003','Admin Operations API','/internal/admin/*','Zero Trust','private',7400,'high','Identity-aware access','review','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO api_inventory (id,api_id,api_name,endpoint_pattern,auth_type,exposure,traffic_24h,risk_level,protection,status,created_at,updated_at) VALUES (4,'API-004','Mobile Session API','/v2/mobile/session','JWT','public',126000,'medium','Bot score + auth rules','active','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: client_reports (4 rows)
INSERT INTO client_reports (id,report_id,title,report_type,audience,period,summary,status,owner,created_at,updated_at) VALUES (1,'CR-2024-001','Executive Security Summary','Monthly','CISO / Security Leadership','2024-12','Summarizes edge protection, API exposure, incidents, SLA posture, and control evidence.','ready','Ibrahim Ghaiyth','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO client_reports (id,report_id,title,report_type,audience,period,summary,status,owner,created_at,updated_at) VALUES (2,'CR-2024-002','DDoS Mitigation Timeline','Incident','SOC / Network Operations','2024-12','Timeline and mitigation notes for L7 and network-level events.','ready','SOC Lead','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO client_reports (id,report_id,title,report_type,audience,period,summary,status,owner,created_at,updated_at) VALUES (3,'CR-2024-003','Zero Trust Exception Register','Access Review','Identity Team','2024-12','Lists active exceptions, expiry requirements, and owner approvals.','review','Client Success Analyst','2026-06-12 03:03:06','2026-06-12 03:03:06');
INSERT INTO client_reports (id,report_id,title,report_type,audience,period,summary,status,owner,created_at,updated_at) VALUES (4,'CR-2024-004','API Risk Remediation Plan','Risk Plan','API Platform Team','2024-Q4','Action plan for auth gaps, endpoint exposure, and schema validation coverage.','draft','SOC Lead','2026-06-12 03:03:06','2026-06-12 03:03:06');

-- data: activity_log (7 rows)
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (1,'Ibrahim Ghaiyth','Designed SentinelDesk Cloudflare client portal concept','system','2024','2026-06-12 03:03:06');
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (2,'SOC Lead','Closed emergency L7 DDoS incident','incidents','INC-2024-001','2026-06-12 03:03:06');
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (3,'Client Success Analyst','Opened bot traffic tuning case','support','CASE-2024-1002','2026-06-12 03:03:06');
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (4,'SOC Lead','Marked API authentication anomaly as P1','incidents','INC-2024-003','2026-06-12 03:03:06');
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (5,'Compliance Team','Generated Q4 security evidence report','reports','RPT-2024-Q4-COMPLIANCE','2026-06-12 03:03:06');
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (6,'Zero Trust Team','Flagged contractor exception policy for review','zero_trust','ZT-APP-002','2026-06-12 03:03:06');
INSERT INTO activity_log (id,actor,action,module,record_ref,created_at) VALUES (7,'Ibrahim Ghaiyth','Logged into SentinelDesk','auth','1','2026-06-12 03:03:33');

COMMIT;
PRAGMA foreign_keys = ON;
