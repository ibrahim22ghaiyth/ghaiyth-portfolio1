from __future__ import annotations

import hashlib
import json
import secrets
import sqlite3
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "app" / "data" / "sentineldesk.sqlite"

# Build the database from seed.sql on first run if it is missing.
if not DB_PATH.exists():
    seed_sql = BASE_DIR / "app" / "data" / "seed.sql"
    if seed_sql.exists():
        _conn = sqlite3.connect(DB_PATH)
        _conn.executescript(seed_sql.read_text(encoding="utf-8"))
        _conn.commit()
        _conn.close()

app = FastAPI(
    title="SentinelDesk Client Portal 2024",
    description="Cybersecurity client portal built by Ibrahim Ghaiyth, 2024.",
    version="1.0.0",
)

app.mount("/assets", StaticFiles(directory=BASE_DIR / "public" / "assets"), name="assets")

sessions: dict[str, dict[str, Any]] = {}

MODULES: dict[str, dict[str, Any]] = {
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


class LoginPayload(BaseModel):
    username: str
    password: str


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def rows(sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
    with connect() as conn:
        return [dict(row) for row in conn.execute(sql, params).fetchall()]


def row(sql: str, params: tuple[Any, ...] = ()) -> dict[str, Any] | None:
    with connect() as conn:
        result = conn.execute(sql, params).fetchone()
        return dict(result) if result else None


def execute(sql: str, params: tuple[Any, ...] = ()) -> int:
    with connect() as conn:
        cur = conn.execute(sql, params)
        conn.commit()
        return int(cur.lastrowid)


def ok(data: Any = None, message: str = "OK") -> dict[str, Any]:
    return {"success": True, "message": message, "data": data}


def fail(status: int, message: str) -> HTTPException:
    return HTTPException(status_code=status, detail=message)


def password_hash(password: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()


def current_user(request: Request) -> dict[str, Any]:
    header = request.headers.get("authorization", "")
    token = header[7:] if header.startswith("Bearer ") else ""
    session = sessions.get(token)
    if not session:
        raise fail(401, "Unauthorized")
    return session


def audit(actor: str, action: str, module: str, record_ref: str = "") -> None:
    execute(
        "INSERT INTO activity_log(actor, action, module, record_ref) VALUES (?,?,?,?)",
        (actor, action, module, record_ref),
    )


def validate_module(module: str) -> dict[str, Any]:
    cfg = MODULES.get(module)
    if not cfg:
        raise fail(404, "Module not found")
    return cfg


@app.get("/")
def index() -> FileResponse:
    return FileResponse(BASE_DIR / "public" / "index.html")


@app.get("/api/health")
def health() -> dict[str, Any]:
    return ok({"status": "running", "database": "SQLite", "portal": "SentinelDesk 2024", "modules": len(MODULES)})


@app.post("/api/auth/login")
def login(payload: LoginPayload) -> dict[str, Any]:
    user = row("SELECT * FROM users WHERE username = ? AND active = 1", (payload.username,))
    if not user or password_hash(payload.password, user["salt"]) != user["password_hash"]:
        raise fail(401, "Invalid credentials")
    token = secrets.token_urlsafe(32)
    sessions[token] = {
        "id": user["id"],
        "full_name": user["full_name"],
        "username": user["username"],
        "role": user["role"],
        "team": user["team"],
    }
    audit(user["full_name"], "Logged into SentinelDesk", "auth", str(user["id"]))
    return ok({"token": token, "user": sessions[token]})


@app.get("/api/me")
def me(request: Request) -> dict[str, Any]:
    user = current_user(request)
    company = row("SELECT * FROM company_profile WHERE id = 1")
    module_meta = {key: {"title": cfg["title"], "fields": cfg["fields"]} for key, cfg in MODULES.items()}
    return ok({"user": user, "company": company, "modules": module_meta})


@app.get("/api/dashboard")
def dashboard(request: Request) -> dict[str, Any]:
    current_user(request)
    total_events = row("SELECT COUNT(*) value FROM security_events")["value"]
    open_incidents = row("SELECT COUNT(*) value FROM incidents WHERE status NOT IN ('resolved','closed')")["value"]
    critical_events = row("SELECT COUNT(*) value FROM security_events WHERE severity IN ('critical','high') AND status NOT IN ('closed','resolved')")["value"]
    avg_risk = row("SELECT ROUND(AVG(risk_score),0) value FROM protected_assets")["value"] or 0
    cases_open = row("SELECT COUNT(*) value FROM support_cases WHERE status NOT IN ('closed','ready')")["value"]
    policy_reviews = row("SELECT COUNT(*) value FROM zero_trust_policies WHERE status IN ('review','disabled')")["value"]
    api_risk = row("SELECT COUNT(*) value FROM api_inventory WHERE risk_level IN ('high','critical')")["value"]
    reports_ready = row("SELECT COUNT(*) value FROM client_reports WHERE status='ready'")["value"]

    event_by_severity = rows("SELECT severity, COUNT(*) count FROM security_events GROUP BY severity")
    service_coverage = rows("SELECT category, COUNT(*) count FROM service_catalog GROUP BY category")
    risk_by_asset = rows("SELECT asset_id, asset_name, risk_score, protection_status FROM protected_assets ORDER BY risk_score DESC LIMIT 6")
    recent_events = rows("SELECT * FROM security_events ORDER BY event_date DESC, id DESC LIMIT 6")
    recent_activity = rows("SELECT * FROM activity_log ORDER BY id DESC LIMIT 8")
    incidents = rows("SELECT * FROM incidents ORDER BY id DESC LIMIT 5")

    return ok({
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
        "event_by_severity": event_by_severity,
        "service_coverage": service_coverage,
        "risk_by_asset": risk_by_asset,
        "recent_events": recent_events,
        "recent_activity": recent_activity,
        "incidents": incidents,
    })


@app.get("/api/modules/{module}")
def module_list(module: str, request: Request, q: str = "") -> dict[str, Any]:
    current_user(request)
    cfg = validate_module(module)
    if q:
        where = " OR ".join([f"LOWER({field}) LIKE ?" for field in cfg["search"]])
        params = tuple([f"%{q.lower()}%" for _ in cfg["search"]])
        data = rows(f"SELECT * FROM {cfg['table']} WHERE {where} ORDER BY id DESC LIMIT 500", params)
    else:
        data = rows(f"SELECT * FROM {cfg['table']} ORDER BY id DESC LIMIT 500")
    return ok(data)


@app.post("/api/modules/{module}")
async def module_create(module: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    cfg = validate_module(module)
    data = await request.json()
    for field in cfg["required"]:
        if not str(data.get(field, "")).strip():
            raise fail(400, f"{field} is required")
    fields = cfg["fields"]
    values = tuple(data.get(field, "") for field in fields)
    placeholders = ",".join(["?"] * len(fields))
    record_id = execute(f"INSERT INTO {cfg['table']}({','.join(fields)}) VALUES ({placeholders})", values)
    audit(user["full_name"], f"Created {cfg['title']}", module, str(record_id))
    return ok(row(f"SELECT * FROM {cfg['table']} WHERE id = ?", (record_id,)), "Created")


@app.put("/api/modules/{module}/{record_id}")
async def module_update(module: str, record_id: int, request: Request) -> dict[str, Any]:
    user = current_user(request)
    cfg = validate_module(module)
    data = await request.json()
    for field in cfg["required"]:
        if not str(data.get(field, "")).strip():
            raise fail(400, f"{field} is required")
    fields = cfg["fields"]
    values = tuple(data.get(field, "") for field in fields) + (record_id,)
    set_sql = ",".join([f"{field}=?" for field in fields])
    execute(f"UPDATE {cfg['table']} SET {set_sql}, updated_at=CURRENT_TIMESTAMP WHERE id=?", values)
    audit(user["full_name"], f"Updated {cfg['title']}", module, str(record_id))
    return ok(row(f"SELECT * FROM {cfg['table']} WHERE id = ?", (record_id,)))


@app.delete("/api/modules/{module}/{record_id}")
def module_delete(module: str, record_id: int, request: Request) -> dict[str, Any]:
    user = current_user(request)
    cfg = validate_module(module)
    try:
        execute(f"DELETE FROM {cfg['table']} WHERE id = ?", (record_id,))
    except sqlite3.IntegrityError as exc:
        raise fail(409, f"Cannot delete record: {exc}")
    audit(user["full_name"], f"Deleted {cfg['title']}", module, str(record_id))
    return ok({"id": record_id})


@app.get("/api/export")
def export_data(request: Request) -> dict[str, Any]:
    current_user(request)
    export: dict[str, Any] = {
        "company_profile": row("SELECT * FROM company_profile WHERE id=1"),
        "modules": {},
    }
    for key, cfg in MODULES.items():
        export["modules"][key] = rows(f"SELECT * FROM {cfg['table']} ORDER BY id DESC")
    return ok(export)
