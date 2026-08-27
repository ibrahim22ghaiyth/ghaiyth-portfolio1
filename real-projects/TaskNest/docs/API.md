# TaskNest API Documentation

Base URL:

```txt
http://localhost:5000/api
```

## Health

```http
GET /health
```

## Auth

### Register

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Ibrahim Ghaiyth",
  "email": "ibrahim@example.com",
  "password": "password123"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "ibrahim@example.com",
  "password": "password123"
}
```

### Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

### Change password

```http
PUT /auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "password123",
  "new_password": "newSecret456"
}
```

Returns `401` if the current password is incorrect.

## Projects

All project routes require:

```http
Authorization: Bearer <token>
```

### List Projects

```http
GET /projects
```

### Create Project

```http
POST /projects
```

```json
{
  "name": "Website Redesign",
  "description": "Client website project",
  "color": "#4f46e5",
  "status": "active"
}
```

### Update Project

```http
PUT /projects/:id
```

### Delete Project

```http
DELETE /projects/:id
```

## Tasks

### List Tasks

```http
GET /tasks
GET /tasks?status=todo
GET /tasks?priority=high
GET /tasks?project_id=1
```

### Create Task

```http
POST /tasks
```

```json
{
  "project_id": 1,
  "title": "Build homepage",
  "description": "Create hero and features sections",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-06-20"
}
```

### Update Task

```http
PUT /tasks/:id
```

### Delete Task

```http
DELETE /tasks/:id
```

## Dashboard

```http
GET /dashboard/stats
```
