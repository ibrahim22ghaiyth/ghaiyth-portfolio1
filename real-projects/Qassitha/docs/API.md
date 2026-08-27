# Qassitha API

Base URL: `http://localhost:3000/api`

All responses follow: `{ "success": true|false, "message"?, "data"|"error" }`

## Dashboard
```http
GET /api/dashboard
```
Returns KPIs (`owedToMe`, `iOwe`, `net`, `overdueCount`, `activeDebts`), plus `overdue` and `dueThisMonth` installment lists.

## Contacts
```http
GET  /api/contacts?q=search
POST /api/contacts        { "name", "phone?", "note?" }
```

## Debts
```http
GET    /api/debts?direction=owed_to_me|i_owe
GET    /api/debts/:id
DELETE /api/debts/:id
POST   /api/debts
```
Create body:
```json
{
  "contact_id": 1,
  "title": "TV installment",
  "total_amount": 800000,
  "installments_count": 4,
  "direction": "owed_to_me",
  "start_date": "2026-06-01",
  "note": ""
}
```
On create, installments are auto-scheduled monthly from `start_date`. The amount is split evenly; the last installment absorbs any rounding remainder so the sum always equals `total_amount`.

## Payments
```http
POST /api/payments   { "installment_id", "amount", "method?", "pay_date?", "note?" }
```
`method` ∈ `cash | zaincash | asiahawala | transfer`. Partial payments are allowed; a payment larger than the installment's remaining balance is rejected. The installment status updates to `partial` or `paid`, and the parent debt's status is recomputed (`active` / `overdue` / `settled`).

## Settings
```http
GET /api/settings
PUT /api/settings   { "owner_name", "business_name", "phone", "currency" }
```
