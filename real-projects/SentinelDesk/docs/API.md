# API Reference

## Auth
POST `/api/auth/login`

## User / Dashboard
GET `/api/me`
GET `/api/dashboard`
GET `/api/export`

## Generic module API
GET `/api/modules/{module}`
POST `/api/modules/{module}`
PUT `/api/modules/{module}/{record_id}`
DELETE `/api/modules/{module}/{record_id}`

Modules:
services, assets, events, incidents, advisories, cases, compliance, zerotrust, apis, reports.
