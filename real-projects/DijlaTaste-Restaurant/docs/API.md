# API

## Public

- GET `/api/health`
- GET `/api/public/bootstrap`
- GET `/api/public/products?category_id=1&q=kebab`
- POST `/api/public/orders`

## Admin بدون تسجيل دخول

- GET `/api/admin/dashboard`
- GET `/api/admin/categories`
- POST `/api/admin/categories`
- PUT `/api/admin/categories/:id`
- DELETE `/api/admin/categories/:id`
- GET `/api/admin/products`
- POST `/api/admin/products`
- PUT `/api/admin/products/:id`
- DELETE `/api/admin/products/:id`
- GET `/api/admin/orders`
- PUT `/api/admin/orders/:id`
- GET `/api/admin/settings`
- PUT `/api/admin/settings`
- GET `/api/admin/export`
