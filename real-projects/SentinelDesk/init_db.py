"""Rebuild the SentinelDesk SQLite database from the single source of truth: app/data/seed.sql

Usage:
    python init_db.py
"""
from __future__ import annotations
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "app" / "data" / "sentineldesk.sqlite"
SEED_SQL = BASE_DIR / "app" / "data" / "seed.sql"


def init_db(force: bool = False) -> None:
    if not SEED_SQL.exists():
        raise FileNotFoundError(f"seed.sql not found at {SEED_SQL}")

    # Remove WAL side files for a clean rebuild
    for suffix in ("", "-wal", "-shm"):
        p = Path(str(DB_PATH) + suffix)
        if p.exists() and (force or suffix == ""):
            p.unlink()

    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SEED_SQL.read_text(encoding="utf-8"))
    conn.commit()
    conn.close()
    print(f"Database rebuilt from seed.sql -> {DB_PATH}")
    print("Login: admin / sentinel2024")


def ensure_db() -> None:
    """Build the database only if it does not exist yet (used at server startup)."""
    if not DB_PATH.exists():
        init_db(force=True)


if __name__ == "__main__":
    init_db(force=True)
