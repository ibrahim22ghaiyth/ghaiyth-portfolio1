# API Reference

## Auth
POST `/api/auth/login`

## Core
GET `/api/health`
GET `/api/me`
GET `/api/dashboard`
GET `/api/reports`

## Generic ERP modules
GET `/api/modules/:module`
POST `/api/modules/:module`
GET `/api/modules/:module/:id`
PUT `/api/modules/:module/:id`
DELETE `/api/modules/:module/:id`

Modules:
crm, customers, vendors, warehouses, inventory, stock, sales, invoices, purchases, accounts, journals, employees, attendance, payroll, projects, tasks, approvals, documents, assets, tickets.
