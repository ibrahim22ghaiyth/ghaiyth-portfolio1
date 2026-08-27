# Database Schema

Real **SQLite** database via `better-sqlite3`.

- **Working file:** `server/data/qassitha.sqlite` (git-ignored, generated at runtime)
- **Source of truth:** `server/data/seed.sql` (schema + demo data)
- **Rebuild:** `npm run reset-db`

## Tables

### `settings` (single row)
Owner name, business name, phone, and currency (default IQD).

### `contacts`
People or businesses (customers, suppliers). Name, phone, note.

### `debts`
A debt or installment plan. Links to a contact. Stores `direction`
(`owed_to_me` / `i_owe`), `total_amount`, `installments_count`, `start_date`,
and a computed `status` (`active` / `overdue` / `settled`).

### `installments`
Auto-generated schedule for each debt: `seq`, `due_date`, `amount`,
`paid_amount`, and `status` (`pending` / `partial` / `paid`).

### `payments`
A log of actual payments against installments: `amount`, `pay_date`,
`method`, `note`.

## Relationships

```txt
contacts 1───∞ debts 1───∞ installments
debts    1───∞ payments
```

## Integrity

- Foreign keys enforced; deleting a debt cascades to its installments and payments.
- Debts are created in a transaction (debt + all installments commit together).
- Installment splitting preserves the total exactly (last installment absorbs the remainder).
