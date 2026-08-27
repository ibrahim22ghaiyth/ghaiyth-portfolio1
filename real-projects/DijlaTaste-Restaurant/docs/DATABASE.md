# Database Schema

The project uses a real **SQLite** database accessed through `better-sqlite3`.

- **Working file:** `server/data/restaurant.sqlite` (git-ignored, generated at runtime)
- **Source of truth:** `server/data/seed.sql` — contains the full schema **and** seed data
- **Rebuild anytime:** `npm run reset-db`

## Tables

### `settings` (single row, id = 1)
Restaurant identity and configuration: bilingual name/slogan/description, phone, WhatsApp, email, address, opening hours, currency, delivery fee, tax percent, social links, and an `accepting_orders` toggle.

### `categories`
Menu sections. Bilingual name & description, icon, sort order, and an `active` flag.

### `products`
Menu items. Linked to a category via `category_id` (foreign key). Bilingual name & description, price, image URL, flags (`available`, `featured`, `vegetarian`), spicy level, calories, and bilingual prep time.

### `orders`
Customer orders. Stores customer name, phone, address, notes, `order_type` (`delivery` / `pickup`), **`payment_method`** (`cash` / `zaincash` / `asiahawala`), `status`, and the computed `subtotal`, `delivery_fee`, `tax`, and `total`.

### `order_items`
Line items for each order. Linked to `orders` via `order_id` (cascade delete) and to `products` via `product_id`. Stores a snapshot of the product name and price at order time, so historical orders stay accurate even if the product later changes.

## Relationships

```txt
categories 1───∞ products
orders     1───∞ order_items
products   1───∞ order_items
```

## Integrity

- Foreign keys are enforced (`PRAGMA foreign_keys = ON`).
- Orders are created inside a transaction — the order and all its items commit together or not at all.
- A category cannot be deleted while products still reference it.
