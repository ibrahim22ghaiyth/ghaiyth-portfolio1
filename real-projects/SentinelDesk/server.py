from __future__ import annotations

import hashlib
import json
import mimetypes
import secrets
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "app" / "data" / "sentineldesk.sqlite"
PUBLIC_DIR = BASE_DIR / "public"

SESSIONS: dict[str, dict] = {}

MODULES: dict[str, dict] = {
    "services": {
        "table": "service_catalog",
        "title": "Service Catalog",
        "fields": ["service_key", "service_name", "category", "summary", "portal_usage", "source_url", "status"],
        "required": ["service_key", "service_name"],
        "search": ["service_key", "service_name", "category", "summary"],
    },
    "assets": {
        "table": "protected_assets",
        "title": "Protected Assets",
        "fields": ["asset_id", "asset_name", "asset_type", "service_key", "environment", "region", "risk_score", "protection_status", "last_review", "owner_team", "notes"],
        "required": ["asset_id", "asset_name", "service_key"],
        "search": ["asset_id", "asset_name", "asset_type", "service_key", "environment", "owner_team"],
    },
    "events": {
        "table": "security_events",
        "title": "Security Events",
        "fields": ["event_id", "event_date", "severity", "event_type", "service_key", "asset_id", "title", "description", "status", "analyst", "mitigation"],
        "required": ["event_id", "event_date", "severity", "title"],
        "search": ["event_id", "severity", "event_type", "title", "status", "analyst"],
    },
    "incidents": {
        "table": "incidents",
        "title": "Incidents",
        "fields": ["incident_no", "opened_at", "severity", "title", "affected_service", "status", "owner", "sla_target", "root_cause", "resolution"],
        "required": ["incident_no", "opened_at", "severity", "title"],
        "search": ["incident_no", "severity", "title", "affected_service", "status", "owner"],
    },
    "advisories": {
        "table": "vulnerability_advisories",
        "title": "Threat Advisories",
        "fields": ["advisory_id", "cve", "published_date", "severity", "product_area", "title", "summary", "status", "source_url"],
        "required": ["advisory_id", "title"],
        "search": ["advisory_id", "cve", "severity", "product_area", "title", "status"],
    },
    "cases": {
        "table": "support_cases",
        "title": "Support Cases",
        "fields": ["case_no", "opened_at", "priority", "requester", "subject", "related_service", "status", "assigned_to", "next_update"],
        "required": ["case_no", "opened_at", "priority", "subject"],
        "search": ["case_no", "priority", "requester", "subject", "related_service", "status"],
    },
    "compliance": {
        "table": "compliance_reports",
        "title": "Compliance Reports",
        "fields": ["report_no", "report_name", "framework", "period", "score", "status", "owner", "evidence_count", "generated_at"],
        "required": ["report_no", "report_name"],
        "search": ["report_no", "report_name", "framework", "period", "status", "owner"],
    },
    "zerotrust": {
        "table": "zero_trust_policies",
        "title": "Zero Trust Policies",
        "fields": ["policy_id", "policy_name", "application", "decision", "identity_provider", "device_posture", "status", "last_changed"],
        "required": ["policy_id", "policy_name"],
        "search": ["policy_id", "policy_name", "application", "decision", "status"],
    },
    "apis": {
        "table": "api_inventory",
        "title": "API Inventory",
        "fields": ["api_id", "api_name", "endpoint_pattern", "auth_type", "exposure", "traffic_24h", "risk_level", "protection", "status"],
        "required": ["api_id", "api_name"],
        "search": ["api_id", "api_name", "endpoint_pattern", "auth_type", "exposure", "risk_level"],
    },
    "reports": {
        "table": "client_reports",
        "title": "Client Reports",
        "fields": ["report_id", "title", "report_type", "audience", "period", "summary", "status", "owner"],
        "required": ["report_id", "title"],
        "search": ["report_id", "title", "report_type", "audience", "period", "status"],
    },
}


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def rows(sql: str, params: tuple = ()) -> list[dict]:
    with connect() as conn:
        return [dict(r) for r in conn.execute(sql, params).fetchall()]


def row(sql: str, params: tuple = ()) -> dict | None:
    with connect() as conn:
        r = conn.execute(sql, params).fetchone()
        return dict(r) if r else None


def execute(sql: str, params: tuple = ()) -> int:
    with connect() as conn:
        cur = conn.execute(sql, params)
        conn.commit()
        return int(cur.lastrowid)


def password_hash(password: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()


def audit(actor: str, action: str, module: str, record_ref: str = "") -> None:
    execute("INSERT INTO activity_log(actor, action, module, record_ref) VALUES (?,?,?,?)", (actor, action, module, record_ref))


def module_meta() -> dict:
    return {key: {"title": cfg["title"], "fields": cfg["fields"]} for key, cfg in MODULES.items()}


def require_module(module: str) -> dict:
    cfg = MODULES.get(module)
    if not cfg:
        raise ValueError("Module not found")
    return cfg


class Handler(BaseHTTPRequestHandler):
    server_version = "SentinelDeskStdlib/1.0"

    def log_message(self, format: str, *args) -> None:
        # Keep terminal cleaner on Windows.
        pass

    def read_json(self) -> dict:
        length = int(self.headers.get("content-length", "0") or "0")
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw) if raw else {}

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def ok(self, data=None, message="OK") -> None:
        self.send_json(200, {"success": True, "message": message, "data": data})

    def fail(self, status: int, error: str) -> None:
        self.send_json(status, {"success": False, "detail": error, "error": error})

    def current_user(self) -> dict | None:
        header = self.headers.get("authorization", "")
        token = header[7:] if header.startswith("Bearer ") else ""
        return SESSIONS.get(token)

    def require_user(self) -> dict | None:
        user = self.current_user()
        if not user:
            self.fail(401, "Unauthorized")
            return None
        return user

    def serve_file(self, path: str) -> None:
        if path == "/":
            file_path = PUBLIC_DIR / "index.html"
        elif path.startswith("/assets/"):
            file_path = PUBLIC_DIR / unquote(path.lstrip("/"))
        else:
            file_path = PUBLIC_DIR / "index.html"

        try:
            file_path = file_path.resolve()
            public_root = PUBLIC_DIR.resolve()
            if public_root not in file_path.parents and file_path != public_root / "index.html":
                self.send_error(403)
                return
            if not file_path.exists() or not file_path.is_file():
                self.send_error(404)
                return

            mime = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
            data = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", mime + ("; charset=utf-8" if mime.startswith("text/") or mime == "application/javascript" else ""))
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as exc:
            self.send_error(500, str(exc))

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        try:
            if not path.startswith("/api/"):
                return self.serve_file(path)

            if path == "/api/health":
                return self.ok({"status": "running", "database": "SQLite", "portal": "SentinelDesk 2024", "modules": len(MODULES), "server": "Python stdlib"})

            user = self.require_user()
            if not user:
                return

            if path == "/api/me":
                return self.ok({
                    "user": user,
                    "company": row("SELECT * FROM company_profile WHERE id = 1"),
                    "modules": module_meta(),
                })

            if path == "/api/dashboard":
                return self.dashboard()

            if path == "/api/export":
                export = {"company_profile": row("SELECT * FROM company_profile WHERE id=1"), "modules": {}}
                for key, cfg in MODULES.items():
                    export["modules"][key] = rows(f"SELECT * FROM {cfg['table']} ORDER BY id DESC")
                return self.ok(export)

            parts = [p for p in path.split("/") if p]
            if len(parts) >= 3 and parts[0] == "api" and parts[1] == "modules":
                module = parts[2]
                cfg = require_module(module)
                q = (query.get("q") or [""])[0].strip().lower()
                if len(parts) == 3:
                    if q:
                        where = " OR ".join([f"LOWER({field}) LIKE ?" for field in cfg["search"]])
                        params = tuple([f"%{q}%" for _ in cfg["search"]])
                        data = rows(f"SELECT * FROM {cfg['table']} WHERE {where} ORDER BY id DESC LIMIT 500", params)
                    else:
                        data = rows(f"SELECT * FROM {cfg['table']} ORDER BY id DESC LIMIT 500")
                    return self.ok(data)
                if len(parts) == 4:
                    record_id = int(parts[3])
                    data = row(f"SELECT * FROM {cfg['table']} WHERE id = ?", (record_id,))
                    if not data:
                        return self.fail(404, "Record not found")
                    return self.ok(data)

            return self.fail(404, "API route not found")
        except Exception as exc:
            return self.fail(500, str(exc))

    def dashboard(self) -> None:
        total_events = row("SELECT COUNT(*) value FROM security_events")["value"]
        open_incidents = row("SELECT COUNT(*) value FROM incidents WHERE status NOT IN ('resolved','closed')")["value"]
        critical_events = row("SELECT COUNT(*) value FROM security_events WHERE severity IN ('critical','high') AND status NOT IN ('closed','resolved')")["value"]
        avg_risk = row("SELECT ROUND(AVG(risk_score),0) value FROM protected_assets")["value"] or 0
        cases_open = row("SELECT COUNT(*) value FROM support_cases WHERE status NOT IN ('closed','ready')")["value"]
        policy_reviews = row("SELECT COUNT(*) value FROM zero_trust_policies WHERE status IN ('review','disabled')")["value"]
        api_risk = row("SELECT COUNT(*) value FROM api_inventory WHERE risk_level IN ('high','critical')")["value"]
        reports_ready = row("SELECT COUNT(*) value FROM client_reports WHERE status='ready'")["value"]

        return self.ok({
            "kpis": {
                "total_events": total_events,
                "open_incidents": open_incidents,
                "critical_events": critical_events,
                "avg_risk": avg_risk,
                "open_cases": cases_open,
                "policy_reviews": policy_reviews,
                "high_risk_apis": api_risk,
                "ready_reports": reports_ready,
            },
            "event_by_severity": rows("SELECT severity, COUNT(*) count FROM security_events GROUP BY severity"),
            "service_coverage": rows("SELECT category, COUNT(*) count FROM service_catalog GROUP BY category"),
            "risk_by_asset": rows("SELECT asset_id, asset_name, risk_score, protection_status FROM protected_assets ORDER BY risk_score DESC LIMIT 6"),
            "recent_events": rows("SELECT * FROM security_events ORDER BY event_date DESC, id DESC LIMIT 6"),
            "recent_activity": rows("SELECT * FROM activity_log ORDER BY id DESC LIMIT 8"),
            "incidents": rows("SELECT * FROM incidents ORDER BY id DESC LIMIT 5"),
        })

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        try:
            if path == "/api/auth/login":
                data = self.read_json()
                user = row("SELECT * FROM users WHERE username = ? AND active = 1", (data.get("username", ""),))
                if not user or password_hash(str(data.get("password", "")), user["salt"]) != user["password_hash"]:
                    return self.fail(401, "Invalid credentials")
                token = secrets.token_urlsafe(32)
                session = {
                    "id": user["id"],
                    "full_name": user["full_name"],
                    "username": user["username"],
                    "role": user["role"],
                    "team": user["team"],
                }
                SESSIONS[token] = session
                audit(session["full_name"], "Logged into SentinelDesk", "auth", str(session["id"]))
                return self.ok({"token": token, "user": session})

            user = self.require_user()
            if not user:
                return

            parts = [p for p in path.split("/") if p]
            if len(parts) == 3 and parts[0] == "api" and parts[1] == "modules":
                module = parts[2]
                cfg = require_module(module)
                data = self.read_json()
                for field in cfg["required"]:
                    if not str(data.get(field, "")).strip():
                        return self.fail(400, f"{field} is required")
                fields = cfg["fields"]
                values = tuple(data.get(field, "") for field in fields)
                placeholders = ",".join(["?"] * len(fields))
                record_id = execute(f"INSERT INTO {cfg['table']}({','.join(fields)}) VALUES ({placeholders})", values)
                audit(user["full_name"], f"Created {cfg['title']}", module, str(record_id))
                return self.ok(row(f"SELECT * FROM {cfg['table']} WHERE id = ?", (record_id,)), "Created")

            return self.fail(404, "API route not found")
        except Exception as exc:
            return self.fail(500, str(exc))

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        try:
            user = self.require_user()
            if not user:
                return

            parts = [p for p in path.split("/") if p]
            if len(parts) == 4 and parts[0] == "api" and parts[1] == "modules":
                module = parts[2]
                record_id = int(parts[3])
                cfg = require_module(module)
                data = self.read_json()
                for field in cfg["required"]:
                    if not str(data.get(field, "")).strip():
                        return self.fail(400, f"{field} is required")
                fields = cfg["fields"]
                values = tuple(data.get(field, "") for field in fields) + (record_id,)
                set_sql = ",".join([f"{field}=?" for field in fields])
                execute(f"UPDATE {cfg['table']} SET {set_sql}, updated_at=CURRENT_TIMESTAMP WHERE id=?", values)
                audit(user["full_name"], f"Updated {cfg['title']}", module, str(record_id))
                return self.ok(row(f"SELECT * FROM {cfg['table']} WHERE id = ?", (record_id,)))

            return self.fail(404, "API route not found")
        except Exception as exc:
            return self.fail(500, str(exc))

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        try:
            user = self.require_user()
            if not user:
                return

            parts = [p for p in path.split("/") if p]
            if len(parts) == 4 and parts[0] == "api" and parts[1] == "modules":
                module = parts[2]
                record_id = int(parts[3])
                cfg = require_module(module)
                try:
                    execute(f"DELETE FROM {cfg['table']} WHERE id = ?", (record_id,))
                except sqlite3.IntegrityError as exc:
                    return self.fail(409, f"Cannot delete record: {exc}")
                audit(user["full_name"], f"Deleted {cfg['title']}", module, str(record_id))
                return self.ok({"id": record_id})

            return self.fail(404, "API route not found")
        except Exception as exc:
            return self.fail(500, str(exc))


def main() -> None:
    # Build the database from seed.sql on first run if it is missing.
    try:
        from init_db import ensure_db
        ensure_db()
    except Exception as exc:
        print(f"Warning: could not auto-initialize database: {exc}")

    host = "127.0.0.1"
    port = 8000
    print("=" * 68)
    print("SentinelDesk 2024 - Windows Ready Server")
    print("No pip install required. No FastAPI/Uvicorn required.")
    print(f"Open: http://{host}:{port}")
    print("Login: admin / sentinel2024")
    print("=" * 68)
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
